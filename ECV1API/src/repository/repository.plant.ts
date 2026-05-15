import Sequelize from "sequelize";
import { Plants as PlantsModel } from "../database/models";
import { type PlantsTypeDB } from "../database/models/Plants";
import { CategoriesEntity } from "../entity/entity.plant";

type PlantModelInstance = InstanceType<typeof PlantsModel>;

export type PlantFamilyRecord = {
    family: string;
    familyPopular: string;
    totalPlants: number;
    default_image: string;
};

export type PaginatedPlants = {
    data: CategoriesEntity[];
    total: number;
};

export class PlantRepository {
    constructor(private readonly model: typeof PlantsModel = PlantsModel) {}

    async create({ id, name, nameEN, scientificName, family, familyPopular, default_image, description }: CategoriesEntity):
        Promise<CategoriesEntity> {
        const createdPlant = await this.model.create({
            id,
            name,
            nameEN,
            scientificName,
            family,
            familyPopular,
            default_image,
            description
        });

        return this.toEntity(createdPlant);
    }

    async upsertMany(plants: CategoriesEntity[]): Promise<void> {
        if (!plants.length) {
            return;
        }

        await this.model.bulkCreate(
            plants.map((plant) => ({
                id: plant.id,
                name: plant.name,
                nameEN: plant.nameEN,
                scientificName: plant.scientificName,
                family: plant.family,
                familyPopular: plant.familyPopular,
                default_image: plant.default_image,
                description: plant.description,
            })),
            {
                updateOnDuplicate: ["name", "nameEN", "scientificName", "family", "familyPopular", "default_image", "description", "updated_at"],
            }
        );
    }

    async count(): Promise<number> {
        return this.model.count();
    }

    async findById(id: number): Promise<CategoriesEntity | undefined> {
        if (!id) {
            throw new Error("Plant id is required");
        }

        const plant = await this.model.findByPk(id);

        if (!plant) {
            return undefined;
        }

        return this.toEntity(plant);
    }

    async findAllPaginated(page: number, perPage: number): Promise<PaginatedPlants> {
        const { rows, count } = await this.model.findAndCountAll({
            limit: perPage,
            offset: this.getOffset(page, perPage),
            order: [["name", "ASC"]],
        });

        return {
            data: rows.map((plant) => this.toEntity(plant)),
            total: count,
        };
    }

    async findAll(): Promise<CategoriesEntity[]> {
        const plants = await this.model.findAll({
            order: [["id", "ASC"]],
        });

        return plants.map((plant) => this.toEntity(plant));
    }

    async findByFamilyPaginated(family: string, page: number, perPage: number): Promise<PaginatedPlants> {
        const normalizedFamily = family.trim().toLowerCase();
        const { rows, count } = await this.model.findAndCountAll({
            where: Sequelize.where(Sequelize.fn("lower", Sequelize.col("family")), normalizedFamily),
            limit: perPage,
            offset: this.getOffset(page, perPage),
            order: [["name", "ASC"]],
        });

        return {
            data: rows.map((plant) => this.toEntity(plant)),
            total: count,
        };
    }

    async findWithoutDescription(): Promise<CategoriesEntity[]> {
        const plants = await this.model.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { description: null },
                    { description: "" },
                ],
            },
            order: [["name", "ASC"]],
        });

        return plants.map((plant) => this.toEntity(plant));
    }

    async updateDescription(id: number, description: string): Promise<void> {
        await this.model.update(
            { description },
            {
                where: {
                    id,
                    [Sequelize.Op.or]: [
                        { description: null },
                        { description: "" },
                    ],
                },
            }
        );
    }

    async updateLocalizedFields(
        id: number,
        localizedFields: Pick<CategoriesEntity, "name" | "nameEN" | "family" | "description">
    ): Promise<void> {
        await this.model.update(
            localizedFields,
            {
                where: { id },
            }
        );
    }

    async findFamiliesPaginated(page: number, perPage: number): Promise<{ data: PlantFamilyRecord[]; total: number }> {
        const families = await this.model.findAll({
            attributes: [
                "family",
                "familyPopular",
                [Sequelize.fn("COUNT", Sequelize.col("id")), "totalPlants"],
                [Sequelize.fn("MAX", Sequelize.col("default_image")), "default_image"],
            ],
            where: {
                family: {
                    [Sequelize.Op.ne]: "",
                },
            },
            group: ["family", "familyPopular"],
            order: [["family", "ASC"]],
            raw: true,
        }) as unknown as Array<{
            family: string;
            familyPopular: string | null;
            totalPlants: string | number;
            default_image: string | null;
        }>;

        const mappedFamilies = families.map((family) => ({
            family: family.family,
            familyPopular: family.familyPopular ?? "",
            totalPlants: Number(family.totalPlants),
            default_image: family.default_image ?? "",
        }));

        return {
            data: mappedFamilies.slice(this.getOffset(page, perPage), this.getOffset(page, perPage) + perPage),
            total: mappedFamilies.length,
        };
    }

    private getOffset(page: number, perPage: number): number {
        return (page - 1) * perPage;
    }

    private toEntity(plant: PlantModelInstance): CategoriesEntity {
        const rawPlant = plant.toJSON() as PlantsTypeDB;

        return new CategoriesEntity({
            id: rawPlant.id,
            name: rawPlant.name,
            nameEN: rawPlant.nameEN,
            scientificName: rawPlant.scientificName,
            family: rawPlant.family,
            familyPopular: rawPlant.familyPopular ?? "",
            default_image: rawPlant.default_image ?? "",
            description: rawPlant.description,
        });
    }
}

export const UsersRepository = PlantRepository;
