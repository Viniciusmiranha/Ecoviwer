import fs from "fs";
import path from "path";
import { Plants, sequelize } from "../database/models";

type PlantRow = {
  id: number;
  name: string;
  nameEN: string;
  scientificName: string;
  family: string;
  default_image?: string | null;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
};

const WORD_TRANSLATIONS: Record<string, string> = {
  aconitifolium: "folha de aconito",
  alba: "branco",
  albus: "branco",
  angustius: "estreito",
  arctic: "artico",
  aurea: "dourado",
  aureus: "dourado",
  beauty: "beleza",
  black: "preto",
  blue: "azul",
  brandywine: "brandywine",
  brocade: "brocado",
  brown: "marrom",
  burgundy: "borgonha",
  carmichaelii: "de Carmichael",
  chip: "chip",
  cold: "frio",
  columnare: "colunar",
  dark: "escuro",
  dwarf: "anao",
  equi: "equi",
  filipendulina: "filipendulina",
  flower: "flor",
  fox: "raposa",
  giant: "gigante",
  glow: "brilho",
  gold: "ouro",
  golden: "dourado",
  green: "verde",
  hardy: "resistente",
  heart: "coracao",
  hybrids: "hibridos",
  ice: "gelo",
  japonica: "japones",
  japonicum: "japones",
  karataviense: "de Karatau",
  leaf: "folha",
  lemon: "limao",
  macrophylla: "folha grande",
  macrophyllum: "folha grande",
  marginata: "marginado",
  minimus: "pequeno",
  mollis: "macio",
  montanus: "montano",
  nana: "anao",
  oak: "carvalho",
  pacifica: "pacifico",
  pink: "rosa",
  plate: "placa",
  purple: "roxo",
  red: "vermelho",
  reptans: "rasteiro",
  rose: "rosa",
  rubra: "vermelho",
  sativum: "cultivado",
  scallop: "concha",
  senescens: "senescente",
  silver: "prateado",
  spinosus: "espinhoso",
  star: "estrela",
  summer: "verao",
  sunset: "por do sol",
  sweet: "doce",
  torch: "tocha",
  trojani: "troiano",
  variegatus: "variegado",
  vera: "vera",
  white: "branco",
  wild: "selvagem",
  yellow: "amarelo",
};

const PHRASE_TRANSLATIONS: Record<string, string> = {
  arcticfox: "raposa do artico",
  blackscallop: "concha preta",
  bluehorizon: "horizonte azul",
  blueyonder: "azul distante",
  burgundyglow: "brilho borgonha",
  catlinsgiant: "gigante de Catlin",
  coldhardywhite: "branco resistente ao frio",
  goldplate: "placa dourada",
  greenflower: "flor verde",
  headbournehybrids: "hibridos Headbourne",
  heartsandflowers: "corações e flores",
  lavenderbubbles: "bolhas lavanda",
  "monk gone wild": "monge selvagem",
  oakleaf: "folha de carvalho",
  "parker s variety": "variedade Parker",
  pinkice: "gelo rosa",
  purplebrocade: "brocado roxo",
  purplesensation: "sensação roxa",
  purpletorch: "tocha roxa",
  redgold: "ouro vermelho",
  rosecreek: "riacho rosa",
  silverbeauty: "beleza prateada",
  silverqueen: "rainha prateada",
  summerbeauty: "beleza de verao",
  summerdrummer: "tamborileiro de verao",
  tasmanianangel: "anjo-da-tasmania",
  thethirdharmonic: "terceira harmônica",
  toffeechip: "toffee chip",
};

function normalizeKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function toPtPhrase(value: string): string {
  const fullPhraseKey = normalizeKey(value);
  const compactPhraseKey = fullPhraseKey.replace(/\s+/g, "");
  const translatedPhrase = PHRASE_TRANSLATIONS[fullPhraseKey] || PHRASE_TRANSLATIONS[compactPhraseKey];

  if (translatedPhrase) {
    return translatedPhrase;
  }

  const words = value
    .replace(/[™®]/g, "")
    .replace(/[-_]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  return words
    .map((word) => {
      const key = normalizeKey(word);
      return WORD_TRANSLATIONS[key] || word.toLowerCase();
    })
    .join(" ")
    .replace(/\bde carmichael\b/g, "de Carmichael")
    .replace(/\bpor do sol\b/g, "pôr do sol")
    .replace(/\bverao beleza\b/g, "beleza de verao")
    .replace(/\bcarvalho folha\b/g, "folha de carvalho")
    .trim();
}

function extractQuotedNames(scientificName: string): string[] {
  return [...scientificName.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

function extractScientificVariation(scientificName: string): string {
  const quotedNames = extractQuotedNames(scientificName);

  if (quotedNames.length) {
    const cultivar = quotedNames[quotedNames.length - 1];
    const afterCultivar = scientificName.split(`'${cultivar}'`).pop() || "";
    const tradeName = afterCultivar
      .replace(/[()]/g, " ")
      .split(/\s+/)
      .filter((part) => /^[A-Z0-9™®-]{3,}$/.test(part))
      .join(" ");

    return toPtPhrase([cultivar, tradeName].filter(Boolean).join(" "));
  }

  const cleanName = scientificName.replace(/[()]/g, " ");
  const tokens = cleanName.split(/\s+/).filter(Boolean);
  const infraIndex = tokens.findIndex((token) =>
    ["var.", "subsp.", "ssp.", "f.", "forma", "group"].includes(token.toLowerCase())
  );

  if (infraIndex >= 0 && tokens[infraIndex + 1]) {
    return toPtPhrase(tokens.slice(infraIndex + 1).join(" "));
  }

  if (tokens.length >= 2) {
    return toPtPhrase(tokens.slice(1).join(" "));
  }

  return toPtPhrase(scientificName);
}

function getDuplicateGroups(rows: PlantRow[]): PlantRow[][] {
  const groupedByName = new Map<string, PlantRow[]>();

  for (const row of rows) {
    const key = normalizeKey(row.name);
    const group = groupedByName.get(key) || [];
    group.push(row);
    groupedByName.set(key, group);
  }

  return [...groupedByName.values()].filter((group) => group.length > 1);
}

function getLatestDedupBackupRows(backupDir: string): PlantRow[] {
  const backupFile = fs
    .readdirSync(backupDir)
    .filter((file) => file.startsWith("plants-name-backup-before-deduplicate-") && file.endsWith(".json"))
    .sort()
    .at(-1);

  if (!backupFile) {
    return [];
  }

  const backup = JSON.parse(fs.readFileSync(path.join(backupDir, backupFile), "utf8")) as { rows?: PlantRow[] };
  return Array.isArray(backup.rows) ? backup.rows : [];
}

function buildUniqueName(baseName: string, scientificName: string, usedNames: Set<string>): string {
  const variation = extractScientificVariation(scientificName);
  let candidate = variation ? `${baseName} ${variation}` : baseName;
  let suffix = 2;

  while (usedNames.has(normalizeKey(candidate))) {
    candidate = `${baseName} ${variation || "variante"} ${suffix}`;
    suffix += 1;
  }

  usedNames.add(normalizeKey(candidate));
  return candidate;
}

async function main(): Promise<void> {
  const plants = await Plants.findAll({
    order: [
      ["name", "ASC"],
      ["scientificName", "ASC"],
      ["id", "ASC"],
    ],
  });

  const rows = plants.map((plant) => plant.toJSON() as PlantRow);
  const backupDir = path.resolve(
    process.env.USERPROFILE || process.cwd(),
    ".codex",
    "memories",
    "ecoviewer-backups"
  );
  const currentDuplicateGroups = getDuplicateGroups(rows);
  const duplicateGroups = currentDuplicateGroups.length
    ? currentDuplicateGroups
    : getDuplicateGroups(getLatestDedupBackupRows(backupDir));
  const currentRowsById = new Map(rows.map((row) => [row.id, row]));
  const duplicateIds = new Set(duplicateGroups.flat().map((row) => row.id));
  const usedNames = new Set(rows.filter((row) => !duplicateIds.has(row.id)).map((row) => normalizeKey(row.name)));
  const updates: Array<{ id: number; from: string; to: string; scientificName: string }> = [];

  for (const group of duplicateGroups) {
    const orderedGroup = [...group].sort((first, second) =>
      first.scientificName.localeCompare(second.scientificName, "pt-BR") || first.id - second.id
    );

    for (const row of orderedGroup) {
      const newName = buildUniqueName(row.name, row.scientificName, usedNames);
      const currentRow = currentRowsById.get(row.id);

      if (currentRow && currentRow.name !== newName) {
        updates.push({
          id: row.id,
          from: currentRow.name,
          to: newName,
          scientificName: row.scientificName,
        });
      }
    }
  }

  fs.mkdirSync(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `plants-name-backup-before-deduplicate-${timestamp}.json`);
  fs.writeFileSync(
    backupPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        rule: "Deduplicate only duplicated plants.name values using scientificName variation.",
        duplicateGroups: duplicateGroups.length,
        updates: updates.length,
        rows,
      },
      null,
      2
    ),
    "utf8"
  );

  await sequelize.transaction(async (transaction) => {
    for (const update of updates) {
      await Plants.update(
        { name: update.to },
        {
          where: { id: update.id },
          transaction,
          silent: true,
        }
      );
    }
  });

  const [remainingDuplicates] = await sequelize.query(
    "SELECT name, COUNT(*)::int AS total FROM plants GROUP BY name HAVING COUNT(*) > 1"
  );

  console.log(`Backup: ${backupPath}`);
  console.log(`Duplicate groups found: ${duplicateGroups.length}`);
  console.log(`Rows updated: ${updates.length}`);
  console.log(`Remaining duplicate groups: ${remainingDuplicates.length}`);
  console.table(updates.slice(0, 30));
}

main()
  .catch((error) => {
    console.error("Error while deduplicating plant names:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
