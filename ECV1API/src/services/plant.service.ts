import { CategoriesEntity } from "../entity/entity.plant";
import { PlantRepository } from "../repository/repository.plant";
import { buildPlantDescription } from "./plant-description.service";
import { getFamilyPopularName } from "./family-popular.service";
import {
    getTranslatedFamilyName,
    getTranslatedPlantName,
    normalizeFamilyName as normalizeLocalizedFamilyName,
} from "./plant-localization.service";

type PerenualImage = {
    original_url?: string;
    regular_url?: string;
    medium_url?: string;
    small_url?: string;
    thumbnail?: string;
};

type PerenualPlant = {
    id?: number;
    common_name?: string | null;
    scientific_name?: string[] | null;
    family?: string | null;
    default_image?: PerenualImage | null;
};

type PerenualListResponse = {
    data?: PerenualPlant[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
};

export type PlantSummary = {
    id: number;
    name: string;
    nameEN: string;
    scientificName: string;
    family: string;
    familyPopular: string;
    default_image: string;
    description?: string | null;
};

type IndexedPlant = Omit<PlantSummary, "description">;

export type FamilySummary = {
    family: string;
    familyPopular: string;
    totalPlants: number;
    default_image: string;
};

export type PaginatedResponse<T> = {
    data: T[];
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
};

export type FamilyPlantsResponse = PaginatedResponse<PlantSummary> & {
    family: string;
    familyPopular: string;
};

export type PlantCareAttentionResponse = {
    plantId: number;
    attention: string;
    source: "perenual" | "fallback";
};

type PlantIndex = {
    plants: PlantSummary[];
    families: FamilySummary[];
    indexedAt: Date;
    completed: boolean;
    stoppedAtPage?: number;
    warning?: string;
};

type PerenualSpeciesDetails = {
    watering?: string | null;
    sunlight?: string[] | string | null;
    care_level?: string | null;
    maintenance?: string | null;
    diseases?: string[] | null;
    poisonous_to_humans?: boolean | null;
    poisonous_to_pets?: boolean | null;
    drought_tolerant?: boolean | null;
    tropical?: boolean | null;
    indoor?: boolean | null;
};

const PERENUAL_API_KEY = process.env.PERENUAL_API_KEY || "sk-M3ov6a0226cf465de17199";
const PERENUAL_BASE_URL = "https://perenual.com/api/v2/species-list";
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 29;
const FAMILY_CAROUSEL_PER_PAGE = 20;
const INDEX_CACHE_TTL_MS = Number(process.env.PLANT_INDEX_CACHE_TTL_MS || 1000 * 60 * 30);
const MAX_INDEX_PAGES = Number(process.env.PERENUAL_MAX_INDEX_PAGES || 25);
const PLANT_DETAILS_CACHE_TTL_MS = Number(process.env.PLANT_DETAILS_CACHE_TTL_MS || 1000 * 60 * 60 * 24);

let cachedPlantIndex: PlantIndex | undefined;
let pendingIndexBuild: Promise<PlantIndex> | undefined;
let pendingDatabaseSeed: Promise<PlantIndex> | undefined;
const plantCareAttentionCache = new Map<number, { data: PlantCareAttentionResponse; cachedAt: number }>();

class PerenualApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly page: number,
        public readonly responseBody: string
    ) {
        super(message);
    }
}

export class PlantService {
    private readonly plantRepository = new PlantRepository();

    async getAll(page: number) {
        const normalizedPage = this.normalizePositiveNumber(page, DEFAULT_PAGE);
        await this.ensureDatabaseHasPlants();
        const plants = await this.plantRepository.findAllPaginated(normalizedPage, DEFAULT_PER_PAGE);

        return this.mapStoredPlants(plants.data);
    }

    async getByFamily(family: string, page: number, perPage = DEFAULT_PER_PAGE): Promise<FamilyPlantsResponse> {
        const requestedFamily = this.normalizeFamilyName(family);

        if (!requestedFamily) {
            throw new Error("Family parameter is required");
        }

        await this.ensureDatabaseHasPlants();
        const normalizedPage = this.normalizePositiveNumber(page, DEFAULT_PAGE);
        const normalizedPerPage = this.normalizePositiveNumber(perPage, DEFAULT_PER_PAGE);
        const paginatedPlants = await this.plantRepository.findByFamilyPaginated(
            requestedFamily,
            normalizedPage,
            normalizedPerPage
        );
        const displayPlants = await this.mapStoredPlants(paginatedPlants.data);

        return {
            family: displayPlants[0]?.family ?? family,
            familyPopular: displayPlants[0]?.familyPopular ?? getFamilyPopularName(family),
            data: displayPlants,
            page: normalizedPage,
            perPage: normalizedPerPage,
            total: paginatedPlants.total,
            totalPages: this.getTotalPages(paginatedPlants.total, normalizedPerPage),
        };
    }

    async getFamilies(page = DEFAULT_PAGE, perPage = FAMILY_CAROUSEL_PER_PAGE): Promise<PaginatedResponse<FamilySummary>> {
        await this.ensureDatabaseHasPlants();
        const normalizedPage = this.normalizePositiveNumber(page, DEFAULT_PAGE);
        const normalizedPerPage = this.normalizePositiveNumber(perPage, FAMILY_CAROUSEL_PER_PAGE);
        const families = await this.plantRepository.findFamiliesPaginated(normalizedPage, normalizedPerPage);

        return {
            data: families.data,
            page: normalizedPage,
            perPage: normalizedPerPage,
            total: families.total,
            totalPages: this.getTotalPages(families.total, normalizedPerPage),
        };
    }

    async getPlantCareAttention(plantId: number): Promise<PlantCareAttentionResponse> {
        const normalizedPlantId = this.normalizePositiveNumber(plantId, 0);

        if (!normalizedPlantId) {
            throw new Error("Plant id is required");
        }

        const cached = plantCareAttentionCache.get(normalizedPlantId);

        if (cached && Date.now() - cached.cachedAt < PLANT_DETAILS_CACHE_TTL_MS) {
            return cached.data;
        }

        const plant = await this.plantRepository.findById(normalizedPlantId);

        if (!plant) {
            throw new Error("Plant not found");
        }

        try {
            const details = await this.fetchPerenualSpeciesDetails(normalizedPlantId);
            const attention = this.buildCareAttentionFromDetails(details, plant.name);
            const data: PlantCareAttentionResponse = {
                plantId: normalizedPlantId,
                attention,
                source: "perenual",
            };

            plantCareAttentionCache.set(normalizedPlantId, { data, cachedAt: Date.now() });

            return data;
        } catch (error) {
            console.error("Perenual care attention error:", error);

            return {
                plantId: normalizedPlantId,
                attention: this.buildFallbackCareAttention(plant),
                source: "fallback",
            };
        }
    }

    async refreshPlantIndex(): Promise<PlantIndex> {
        cachedPlantIndex = await this.buildPlantIndex();
        return cachedPlantIndex;
    }

    private async ensureDatabaseHasPlants(): Promise<PlantIndex | undefined> {
        const totalPlants = await this.plantRepository.count();

        if (totalPlants > 0) {
            return undefined;
        }

        if (!pendingDatabaseSeed) {
            pendingDatabaseSeed = this.refreshPlantIndex().finally(() => {
                pendingDatabaseSeed = undefined;
            });
        }

        return pendingDatabaseSeed;
    }

    private async getPlantIndex(): Promise<PlantIndex> {
        if (cachedPlantIndex && Date.now() - cachedPlantIndex.indexedAt.getTime() < INDEX_CACHE_TTL_MS) {
            return cachedPlantIndex;
        }

        if (!pendingIndexBuild) {
            pendingIndexBuild = this.buildPlantIndex().catch((error) => {
                if (cachedPlantIndex) {
                    cachedPlantIndex.warning = error instanceof Error ? error.message : "Erro ao atualizar indice";
                    return cachedPlantIndex;
                }

                throw error;
            }).finally(() => {
                pendingIndexBuild = undefined;
            });
        }

        cachedPlantIndex = await pendingIndexBuild;
        return cachedPlantIndex;
    }

    private async buildPlantIndex(): Promise<PlantIndex> {
        const indexedPlants = new Map<number, IndexedPlant>();
        let currentPage = 1;
        let lastPage = 1;
        let completed = true;
        let stoppedAtPage: number | undefined;
        let warning: string | undefined;

        do {
            let response: PerenualListResponse;

            try {
                response = await this.fetchPerenualPage(currentPage);
            } catch (error) {
                completed = false;
                stoppedAtPage = currentPage;
                warning = error instanceof Error ? error.message : `Erro ao buscar página ${currentPage} da Perenual`;

                break;
            }

            const plants = response.data ?? [];

            for (const plant of plants) {
                const mappedPlant = this.mapPerenualPlant(plant);

                if (mappedPlant.id && mappedPlant.family) {
                    indexedPlants.set(mappedPlant.id, mappedPlant);
                }
            }

            lastPage = this.normalizePositiveNumber(response.last_page, currentPage);
            currentPage += 1;
        } while (currentPage <= lastPage && currentPage <= MAX_INDEX_PAGES);

        if (currentPage <= lastPage && currentPage > MAX_INDEX_PAGES) {
            completed = false;
            stoppedAtPage = MAX_INDEX_PAGES;
            warning = `Índice limitado a ${MAX_INDEX_PAGES} páginas para preservar o limite diário da Perenual`;
        }

        const plants = Array.from(indexedPlants.values()).sort((firstPlant, secondPlant) =>
            firstPlant.name.localeCompare(secondPlant.name)
        );
        const storedPlants = await this.savePlants(plants);

        return {
            plants: storedPlants,
            families: this.buildFamilies(storedPlants),
            indexedAt: new Date(),
            completed,
            stoppedAtPage,
            warning,
        };
    }

    private buildFamilies(plants: Array<IndexedPlant | PlantSummary>): FamilySummary[] {
        const families = new Map<string, FamilySummary>();

        for (const plant of plants) {
            const familyKey = this.normalizeFamilyName(plant.family);
            const currentFamily = families.get(familyKey);

            if (currentFamily) {
                currentFamily.totalPlants += 1;

                if (!currentFamily.default_image && plant.default_image) {
                    currentFamily.default_image = plant.default_image;
                }

                continue;
            }

            families.set(familyKey, {
                family: plant.family,
                familyPopular: plant.familyPopular || getFamilyPopularName(plant.family),
                totalPlants: 1,
                default_image: plant.default_image,
            });
        }

        return Array.from(families.values()).sort((firstFamily, secondFamily) =>
            firstFamily.family.localeCompare(secondFamily.family)
        );
    }

    private async fetchPerenualPage(page: number): Promise<PerenualListResponse> {
        const url = new URL(PERENUAL_BASE_URL);
        url.searchParams.set("key", PERENUAL_API_KEY);
        url.searchParams.set("page", String(page));

        let response: Response;

        try {
            response = await fetch(url);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "erro de rede desconhecido";

            throw new Error(`Não foi possível conectar a Perenual ao buscar a página ${page}. ${errorMessage}`);
        }

        if (!response.ok) {
            const responseBody = await response.text();

            if (response.status === 429) {
                throw new PerenualApiError(
                    `Limite diário da Perenual excedido ao buscar a página ${page}. Tente novamente após o período indicado pela API ou reduza PERENUAL_MAX_INDEX_PAGES.`,
                    response.status,
                    page,
                    responseBody
                );
            }

            throw new PerenualApiError(
                `Erro ao buscar dados da Perenual na página ${page}. Status ${response.status}. Resposta: ${responseBody.slice(0, 300)}`,
                response.status,
                page,
                responseBody
            );
        }

        return response.json() as Promise<PerenualListResponse>;
    }

    private async fetchPerenualSpeciesDetails(plantId: number): Promise<PerenualSpeciesDetails> {
        const url = new URL(`https://www.perenual.com/api/v2/species/details/${plantId}`);
        url.searchParams.set("key", PERENUAL_API_KEY);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch(url, { signal: controller.signal });

            if (!response.ok) {
                const responseBody = await response.text();

                throw new PerenualApiError(
                    `Erro ao buscar detalhes da planta ${plantId}. Status ${response.status}. Resposta: ${responseBody.slice(0, 300)}`,
                    response.status,
                    1,
                    responseBody
                );
            }

            return response.json() as Promise<PerenualSpeciesDetails>;
        } finally {
            clearTimeout(timeout);
        }
    }

    private buildCareAttentionFromDetails(details: PerenualSpeciesDetails, plantName: string): string {
        const notes: string[] = [];
        const watering = this.translateWatering(details.watering);
        const sunlight = this.translateSunlight(details.sunlight);
        const careLevel = this.translateCareLevel(details.care_level);
        const maintenance = this.translateMaintenance(details.maintenance);
        const diseases = Array.isArray(details.diseases)
            ? details.diseases
                .map((disease) => this.translateDiseaseName(disease))
                .filter(Boolean)
                .slice(0, 3)
            : [];

        if (watering) {
            notes.push(`regas em nível ${watering}`);
        }

        if (sunlight) {
            notes.push(`luz ${sunlight}`);
        }

        if (careLevel) {
            notes.push(`cuidado ${careLevel}`);
        }

        if (maintenance) {
            notes.push(`manutenção ${maintenance}`);
        }

        if (details.poisonous_to_humans || details.poisonous_to_pets) {
            notes.push("evite ingestão e mantenha longe de crianças e animais");
        }

        if (details.drought_tolerant) {
            notes.push("tolera períodos curtos de seca");
        }

        if (details.tropical) {
            notes.push("prefere calor, umidade e proteção contra frio intenso");
        }

        if (details.indoor) {
            notes.push("pode ser cultivada em ambiente interno bem iluminado");
        }

        if (diseases.length) {
            notes.push(`observe sinais de ${diseases.join(", ")}`);
        }

        if (!notes.length) {
            return `Para ${plantName}, observe a resposta da planta ao ambiente: folhas amareladas, murcha, manchas e queda de folhas geralmente indicam ajuste necessário de luz, rega ou drenagem.`;
        }

        return `Para ${plantName}, tenha atenção a ${notes.join("; ")}. Ajuste o cultivo conforme sinais nas folhas, no substrato e no crescimento da planta.`;
    }

    private buildFallbackCareAttention(plant: CategoriesEntity): string {
        return `Para ${plant.name}, acompanhe sinais como folhas amareladas, murcha, manchas, queda de folhas ou substrato constantemente encharcado. Esses sintomas costumam indicar necessidade de ajustar rega, luminosidade, drenagem ou ventilacao.`;
    }

    private translateWatering(watering?: string | null): string {
        const normalizedWatering = this.normalizeApiToken(watering);
        const translations: Record<string, string> = {
            frequent: "frequente",
            average: "moderado",
            minimum: "baixo",
            none: "muito baixo",
        };

        return translations[normalizedWatering] || "";
    }

    private translateSunlight(sunlight?: string[] | string | null): string {
        const values = Array.isArray(sunlight) ? sunlight : [sunlight];
        const translations: Record<string, string> = {
            full_shade: "de sombra",
            part_shade: "de meia-sombra",
            "sun-part_shade": "de sol com meia-sombra",
            sun_part_shade: "de sol com meia-sombra",
            full_sun: "de sol pleno",
            sunlight: "com luminosidade",
            filtered_sun: "de sol filtrado",
            filtered_light: "de luz filtrada",
            bright_indirect_light: "de luz indireta forte",
            indirect_light: "de luz indireta",
            partial_sun: "de sol parcial",
            partial_shade: "de meia-sombra",
            shade: "de sombra",
            sun: "de sol",
        };

        return values
            .map((value) => translations[this.normalizeApiToken(value)] || "")
            .filter(Boolean)
            .join(", ");
    }

    private translateCareLevel(careLevel?: string | null): string {
        const normalizedCareLevel = this.normalizeApiToken(careLevel);
        const translations: Record<string, string> = {
            low: "baixo",
            medium: "médio",
            moderate: "moderado",
            high: "alto",
        };

        return translations[normalizedCareLevel] || "";
    }

    private translateMaintenance(maintenance?: string | null): string {
        return this.translateCareLevel(maintenance);
    }

    private translateDiseaseName(disease?: string | null): string {
        const normalizedDisease = this.normalizeApiToken(disease);
        const translations: Record<string, string> = {
            root_rot: "podridão de raiz",
            leaf_spot: "mancha foliar",
            black_spot: "mancha-negra",
            powdery_mildew: "oídio",
            downy_mildew: "míldio",
            mildew: "míldio",
            rust: "ferrugem",
            blight: "queima das folhas",
            anthracnose: "antracnose",
            fungus: "fungos",
            fungi: "fungos",
            fungal_disease: "doença fúngica",
            aphids: "pulgões",
            aphid: "pulgões",
            mites: "ácaros",
            spider_mites: "ácaros",
            mealybugs: "cochonilhas",
            mealybug: "cochonilhas",
            scale: "cochonilhas",
            whiteflies: "mosca-branca",
            whitefly: "mosca-branca",
            thrips: "tripes",
            caterpillars: "lagartas",
            caterpillar: "lagartas",
        };

        return translations[normalizedDisease] || this.translateDiseaseByParts(normalizedDisease);
    }

    private translateDiseaseByParts(normalizedDisease: string): string {
        if (!normalizedDisease) {
            return "";
        }

        if (normalizedDisease.includes("rot")) {
            return "podridão";
        }

        if (normalizedDisease.includes("mildew")) {
            return "míldio";
        }

        if (normalizedDisease.includes("spot")) {
            return "manchas foliares";
        }

        if (normalizedDisease.includes("rust")) {
            return "ferrugem";
        }

        if (normalizedDisease.includes("fung")) {
            return "fungos";
        }

        if (normalizedDisease.includes("aphid")) {
            return "pulgões";
        }

        if (normalizedDisease.includes("mite")) {
            return "ácaros";
        }

        if (normalizedDisease.includes("mealy")) {
            return "cochonilhas";
        }

        return "";
    }

    private normalizeApiToken(value?: string | null): string {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
    }

    private mapPerenualPlant(plant: PerenualPlant): IndexedPlant {
        const nameEN = plant.common_name?.trim() || "Unknown plant";
        const scientificName = plant.scientific_name?.[0]?.trim() ?? "";
        const family = getTranslatedFamilyName(plant.family);
        const familyPopular = getFamilyPopularName(family);
        const name = getTranslatedPlantName({ name: nameEN, nameEN, scientificName });

        return {
            id: Number(plant.id),
            name,
            nameEN,
            scientificName,
            family,
            familyPopular,
            default_image: this.getBestPlantImage(plant.default_image),
        };
    }

    private getBestPlantImage(image?: PerenualImage | null): string {
        return image?.original_url ?? image?.regular_url ?? image?.medium_url ?? image?.small_url ?? image?.thumbnail ?? "";
    }

    private async mapPlantsWithoutTranslation(plants: IndexedPlant[]): Promise<PlantSummary[]> {
        return plants.map((plant) => ({
            ...plant,
            description: buildPlantDescription(plant),
        }));
    }

    private async mapStoredPlants(plants: CategoriesEntity[]): Promise<PlantSummary[]> {
        return plants.map((plant) => ({
            id: plant.id,
            name: plant.name,
            nameEN: plant.nameEN,
            scientificName: plant.scientificName,
            family: plant.family,
            familyPopular: plant.familyPopular || getFamilyPopularName(plant.family),
            default_image: plant.default_image,
            description: plant.description ?? "",
        }));
    }

    private async savePlants(plants: IndexedPlant[]): Promise<PlantSummary[]> {
        const mappedPlants = await this.mapPlantsWithoutTranslation(plants);
        const plantEntities = mappedPlants.map((plant) => new CategoriesEntity({
            id: plant.id,
            name: plant.name,
            nameEN: plant.nameEN,
            scientificName: plant.scientificName,
            family: plant.family,
            familyPopular: plant.familyPopular || getFamilyPopularName(plant.family),
            default_image: plant.default_image,
            description: plant.description ?? buildPlantDescription(plant),
        }));

        await this.plantRepository.upsertMany(plantEntities);

        return mappedPlants.map((plant) => ({
            ...plant,
            description: plant.description ?? buildPlantDescription(plant),
        }));
    }

    private paginate<T>(items: T[], page: number, perPage: number): PaginatedResponse<T> {
        const normalizedPage = this.normalizePositiveNumber(page, DEFAULT_PAGE);
        const normalizedPerPage = this.normalizePositiveNumber(perPage, DEFAULT_PER_PAGE);
        const totalPages = Math.ceil(items.length / normalizedPerPage);
        const startIndex = (normalizedPage - 1) * normalizedPerPage;

        return {
            data: items.slice(startIndex, startIndex + normalizedPerPage),
            page: normalizedPage,
            perPage: normalizedPerPage,
            total: items.length,
            totalPages,
        };
    }

    private getTotalPages(total: number, perPage: number): number {
        return Math.ceil(total / perPage);
    }

    private normalizePositiveNumber(value: unknown, fallback: number): number {
        const numberValue = Number(value);

        if (!Number.isFinite(numberValue) || numberValue < 1) {
            return fallback;
        }

        return Math.floor(numberValue);
    }

    private normalizeFamilyName(family: string): string {
        return normalizeLocalizedFamilyName(family);
    }
}
