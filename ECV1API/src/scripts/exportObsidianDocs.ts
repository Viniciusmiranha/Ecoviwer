import fs from "fs";
import path from "path";
import { sequelize } from "../database/models";

type FamilyDocRow = {
    family: string;
    family_popular: string;
    total: number;
};

type PlantNameDocRow = {
    id: number;
    name: string;
    name_en: string;
    scientific_name: string;
    family: string;
};

const OBSIDIAN_DIR = "C:\\Users\\Veloz Notes\\OneDrive\\Documentos\\Obsidian Vault\\01_Projetos\\EcoViewer\\01_Projetos\\ecoviewer_plantas";

function escapeTable(value: unknown): string {
    return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function getCarouselDisplayName(familyPopular: string, fallback: string): string {
    return familyPopular
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)[0] || fallback;
}

async function buildFamilyPopularDoc(): Promise<string> {
    const [rows] = await sequelize.query(`
        SELECT family,
               MAX("familyPopular") AS family_popular,
               COUNT(*)::int AS total
          FROM plants
         GROUP BY family
         ORDER BY family ASC
    `);
    const families = rows as FamilyDocRow[];

    return [
        "# Familias - Nomes Populares",
        "",
        "tags: #ecoviewer #familias #familyPopular #frontend #database",
        "",
        "## Objetivo",
        "",
        "Esta nota registra o campo `plants.familyPopular`, criado para guardar nomes populares brasileiros relacionados a cada familia botanica.",
        "",
        "O campo `family` continua sendo o identificador tecnico usado em agrupamento, filtro e URL. O campo `familyPopular` e usado para exibicao amigavel no front-end.",
        "",
        "## Regra do carrossel",
        "",
        "No front-end `Ecoviwer`, o carrossel de `categoria.html` continua navegando por `family`, mas mostra no titulo do card apenas o primeiro nome de `familyPopular`.",
        "",
        "Exemplo: `Amarantaceas` navega usando a familia botanica, mas aparece no card como `caruru`.",
        "",
        "## Cuidados",
        "",
        "- Nao rodar refresh/reimportacao para preencher esse campo em banco existente.",
        "- Para registros existentes, preencher apenas `familyPopular`.",
        "- Nao alterar `name`, `nameEN`, `scientificName`, `family`, `description` ou `default_image` ao manter este campo.",
        "",
        "## Lista atual",
        "",
        "| family | familyPopular | Nome exibido no carrossel | Total |",
        "|---|---|---|---:|",
        ...families.map((family) => {
            const popular = family.family_popular || "";
            const display = getCarouselDisplayName(popular, family.family);
            return `| ${escapeTable(family.family)} | ${escapeTable(popular)} | ${escapeTable(display)} | ${family.total} |`;
        }),
        "",
    ].join("\n");
}

async function buildPlantNamesDoc(): Promise<string> {
    const [rows] = await sequelize.query(`
        SELECT id,
               name,
               "nameEN" AS name_en,
               "scientificName" AS scientific_name,
               family
          FROM plants
         ORDER BY LOWER("nameEN") ASC, id ASC
    `);
    const plants = rows as PlantNameDocRow[];

    return [
        "# Nomes de Plantas - Ingles e Portugues",
        "",
        "tags: #ecoviewer #plantas #nomes #ptbr #database",
        "",
        "## Objetivo",
        "",
        "Esta nota registra a lista atual de nomes de plantas gravada no banco local `ecoviewerDB`, relacionando o nome original em ingles (`nameEN`) com o nome em portugues brasileiro usado no campo `name`.",
        "",
        "## Regra aplicada",
        "",
        "- `nameEN` preserva o nome original em ingles.",
        "- `name` e o nome principal exibido no front-end em portugues brasileiro.",
        "- `scientificName` nao foi traduzido.",
        "- A lista abaixo foi extraida do banco apos a normalizacao de nomes e remocao de duplicados.",
        "",
        "## Validacao atual",
        "",
        `- Total de plantas: ${plants.length}`,
        "- Ordem: `lower(nameEN) ASC, id ASC`",
        "",
        "## Lista",
        "",
        "| id | nameEN | name | scientificName | family |",
        "|---:|---|---|---|---|",
        ...plants.map((plant) =>
            `| ${plant.id} | ${escapeTable(plant.name_en)} | ${escapeTable(plant.name)} | ${escapeTable(plant.scientific_name)} | ${escapeTable(plant.family)} |`
        ),
        "",
    ].join("\n");
}

async function main(): Promise<void> {
    fs.mkdirSync(OBSIDIAN_DIR, { recursive: true });

    const familyPopularPath = path.join(OBSIDIAN_DIR, "Familias_Nomes_Populares.md");
    const plantNamesPath = path.join(OBSIDIAN_DIR, "Nomes_Plantas_EN_PTBR.md");

    fs.writeFileSync(familyPopularPath, await buildFamilyPopularDoc(), "utf8");
    fs.writeFileSync(plantNamesPath, await buildPlantNamesDoc(), "utf8");

    console.log(`Wrote ${familyPopularPath}`);
    console.log(`Wrote ${plantNamesPath}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await sequelize.close();
    });
