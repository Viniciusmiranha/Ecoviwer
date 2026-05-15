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

const PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bgreen mountain\b/gi, "montanha verde"],
  [/\bburgundy lace\b/gi, "renda borgonha"],
  [/\bkaleidoscope\b/gi, "caleidoscópio"],
  [/\bsummer beauty\b/gi, "beleza de verão"],
  [/\bsummer breeze\b/gi, "brisa de verão"],
  [/\bsummer glow\b/gi, "brilho de verão"],
  [/\bsummer pastels group\b/gi, "grupo tons pasteis de verão"],
  [/\braspberry summer\b/gi, "verão framboesa"],
  [/\boak leaf\b/gi, "folha de carvalho"],
  [/\btasmanian angel\b/gi, "anjo-da-tasmânia"],
  [/\bblue horizon\b/gi, "horizonte azul"],
  [/\bblue yonder\b/gi, "azul distante"],
  [/\bcold hardy white\b/gi, "branco resistente ao frio"],
  [/\bheadbourne hybrids\b/gi, "híbridos Headbourne"],
  [/\bthe third harmonic\b/gi, "terceira harmônica"],
  [/\bgold plate\b/gi, "placa dourada"],
  [/\bred gold\b/gi, "ouro vermelho"],
  [/\bsilver queen\b/gi, "rainha prateada"],
  [/\bpink ice\b/gi, "gelo rosa"],
  [/\barctic fox\b/gi, "raposa do ártico"],
  [/\bblack scallop\b/gi, "concha preta"],
  [/\bburgundy glow\b/gi, "brilho borgonha"],
  [/\bpurple brocade\b/gi, "brocado roxo"],
  [/\bpurple torch\b/gi, "tocha roxa"],
  [/\bsilver beauty\b/gi, "beleza prateada"],
  [/\btoffee chip\b/gi, "lasca de caramelo"],
  [/\bchocolate chip\b/gi, "lasca de chocolate"],
  [/\blavender bubbles\b/gi, "bolhas lavanda"],
  [/\bpurple sensation\b/gi, "sensação roxa"],
  [/\bheart throb\b/gi, "coração pulsante"],
  [/\bhearts of gold\b/gi, "corações de ouro"],
  [/\brose creek\b/gi, "riacho rosa"],
  [/\bmonk gone wild\b/gi, "monge selvagem"],
  [/\bparker s variety\b/gi, "variedade Parker"],
  [/\bcatlin s giant\b/gi, "gigante de Catlin"],
  [/\bcatlins giant\b/gi, "gigante de Catlin"],
  [/\bhearts and flowers\b/gi, "corações e flores"],
  [/\bred sunset\b/gi, "pôr do sol vermelho"],
  [/\bred select\b/gi, "seleção vermelha"],
  [/\bred obelisk\b/gi, "obelisco vermelho"],
  [/\bred fox\b/gi, "raposa vermelha"],
  [/\bscarlet sentinel\b/gi, "sentinela escarlate"],
  [/\bgolden anniversary\b/gi, "aniversário dourado"],
  [/\bsilver anniversary\b/gi, "aniversário prateado"],
  [/\bsunny anniversary\b/gi, "aniversário ensolarado"],
  [/\bsweet emotion\b/gi, "doce emoção"],
  [/\bbracken s brown beauty\b/gi, "beleza marrom de Bracken"],
  [/\beddie s white wonder\b/gi, "maravilha branca de Eddie"],
  [/\bchina girl\b/gi, "menina chinesa"],
  [/\bcherokee brave\b/gi, "bravo cherokee"],
  [/\bcherokee chief\b/gi, "chefe cherokee"],
  [/\bcherokee daybreak\b/gi, "amanhecer cherokee"],
  [/\bcherokee princess\b/gi, "princesa cherokee"],
  [/\bcherokee sunset\b/gi, "pôr do sol cherokee"],
  [/\bblue shadow\b/gi, "sombra azul"],
  [/\bblue star\b/gi, "estrela azul"],
  [/\bblue chip\b/gi, "chip azul"],
  [/\bchip azul\b/gi, "lasca azul"],
  [/\bdixie chip\b/gi, "lasca dixie"],
  [/\bautumn flame\b/gi, "chama de outono"],
  [/\bautumn gold\b/gi, "ouro de outono"],
  [/\bbloodgood\b/gi, "sangue-bom"],
  [/\bbutterflies\b/gi, "borboletas"],
  [/\bbutterfly\b/gi, "borboleta"],
  [/\bbush s electra\b/gi, "electra de Bush"],
  [/\bgreen cascade\b/gi, "cascata verde"],
  [/\bemerald queen\b/gi, "rainha esmeralda"],
  [/\bwhite pearl\b/gi, "pérola branca"],
  [/\bpink diamond\b/gi, "diamante rosa"],
  [/\bgold rush\b/gi, "corrida do ouro"],
  [/\bgold strike\b/gi, "golpe dourado"],
  [/\bcrimson king\b/gi, "rei carmesim"],
  [/\bcrimson sentry\b/gi, "sentinela carmesim"],
  [/\bcrimson frost\b/gi, "geada carmesim"],
  [/\bcoral sun\b/gi, "sol coral"],
  [/\blittle woody\b/gi, "pequeno lenhoso"],
  [/\blittle gem\b/gi, "pequena joia"],
  [/\bsnow sport\b/gi, "esporte da neve"],
  [/\blittle moonshine\b/gi, "pequeno luar"],
  [/\bmocha rose\b/gi, "rosa mocha"],
  [/\bglory of the andes\b/gi, "glória dos andes"],
  [/\belectra blue\b/gi, "azul electra"],
  [/\bbush s electra\b/gi, "elettra do arbusto"],
  [/\bfullmoon\b/gi, "lua cheia"],
  [/\bfull moon\b/gi, "lua cheia"],
  [/\bbig leaf\b/gi, "folha grande"],
  [/\bpaperbark\b/gi, "casca de papel"],
  [/\bsnakebark\b/gi, "casca de cobra"],
  [/\bcutleaf\b/gi, "folha recortada"],
  [/\bfragrant\b/gi, "perfumado"],
  [/\bglossy\b/gi, "brilhante"],
];

const WORD_REPLACEMENTS: Record<string, string> = {
  amber: "âmbar",
  appalachian: "apalache",
  ambassador: "embaixador",
  anniversary: "aniversário",
  angel: "anjo",
  arctic: "ártico",
  autumn: "outono",
  beauty: "beleza",
  big: "grande",
  black: "preto",
  blue: "azul",
  brave: "bravo",
  breeze: "brisa",
  bronze: "bronze",
  brown: "marrom",
  bubbles: "bolhas",
  burgundy: "borgonha",
  butterfly: "borboleta",
  butterflies: "borboletas",
  bush: "bush",
  cascade: "cascata",
  chip: "chip",
  chocolate: "chocolate",
  cold: "frio",
  copper: "cobre",
  coral: "coral",
  cream: "creme",
  crimson: "carmesim",
  dark: "escuro",
  dawyck: "dawyck",
  diamond: "diamante",
  dragon: "dragão",
  dwarf: "anão",
  eddie: "eddie",
  emerald: "esmeralda",
  emotion: "emoção",
  emperor: "imperador",
  fire: "fogo",
  flame: "chama",
  flamingo: "flamingo",
  flower: "flor",
  flowers: "flores",
  forelock: "topete",
  fox: "raposa",
  frost: "geada",
  giant: "gigante",
  girl: "menina",
  globemaster: "mestre global",
  glory: "glória",
  glow: "brilho",
  gold: "ouro",
  golden: "dourado",
  green: "verde",
  hardy: "resistente",
  group: "grupo",
  harmonic: "harmônica",
  heart: "coração",
  hearts: "corações",
  horizon: "horizonte",
  hybrids: "híbridos",
  ice: "gelo",
  electra: "elettra",
  jewel: "joia",
  king: "rei",
  lace: "renda",
  lavender: "lavanda",
  leaf: "folha",
  lemon: "limão",
  light: "claro",
  lime: "lima",
  little: "pequeno",
  maple: "bordo",
  miss: "senhorita",
  marmo: "mármore",
  millenium: "milênio",
  mocha: "mocha",
  moonshine: "luar",
  mountain: "montanha",
  music: "música",
  narrow: "estreito",
  oak: "carvalho",
  orange: "laranja",
  obelisk: "obelisco",
  of: "de",
  pastels: "tons pasteis",
  pearl: "pérola",
  pink: "rosa",
  plate: "placa",
  princess: "princesa",
  prince: "príncipe",
  princeton: "princeton",
  purple: "roxo",
  queen: "rainha",
  raspberry: "framboesa",
  red: "vermelho",
  roja: "vermelha",
  rose: "rosa",
  royal: "real",
  rush: "corrida",
  ruby: "rubi",
  scallop: "concha",
  scarlet: "escarlate",
  shadow: "sombra",
  select: "seleção",
  sentry: "sentinela",
  sherwood: "sherwood",
  silver: "prateado",
  snow: "neve",
  spanish: "espanhol",
  spring: "primavera",
  star: "estrela",
  sport: "esporte",
  summer: "verão",
  sun: "sol",
  sunny: "ensolarado",
  sunset: "pôr do sol",
  sweet: "doce",
  the: "os",
  third: "terceira",
  throb: "pulsante",
  toffee: "caramelo",
  torch: "tocha",
  upright: "ereto",
  variegated: "variegado",
  variety: "variedade",
  velvet: "veludo",
  weeping: "pendente",
  white: "branco",
  wild: "selvagem",
  wine: "vinho",
  winter: "inverno",
  wonder: "maravilha",
  woody: "lenhoso",
  yellow: "amarelo",
  yonder: "distante",
  andes: "andes",
};

function normalizeSpacing(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+-\s+/g, "-")
    .replace(/\s+\/\s+/g, " / ")
    .trim();
}

function translateRemainingWords(value: string): string {
  return value.replace(/\b[A-Za-z][A-Za-z']*\b/g, (word) => {
    const key = word.toLowerCase().replace(/'/g, " ");
    return WORD_REPLACEMENTS[key] || word;
  });
}

function normalizeName(name: string): string {
  let nextName = name;

  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    nextName = nextName.replace(pattern, replacement);
  }

  nextName = translateRemainingWords(nextName);
  nextName = nextName
    .replace(/\bverão beleza\b/g, "beleza de verão")
    .replace(/\bcarvalho folha\b/g, "folha de carvalho")
    .replace(/\braspberry verão\b/g, "verão framboesa")
    .replace(/\bverão brilho\b/g, "brilho de verão")
    .replace(/\bverão brisa\b/g, "brisa de verão")
    .replace(/\bverão cascata\b/g, "cascata de verão")
    .replace(/\bverão chocolate\b/g, "chocolate de verão")
    .replace(/\bframboesa verão\b/g, "verão framboesa")
    .replace(/\bverão tons pasteis group\b/g, "grupo tons pasteis de verão")
    .replace(/\bbrilho borgonha\b/g, "brilho borgonha")
    .replace(/\bcorações de ouro\b/g, "corações de ouro")
    .replace(/\btasmânia anjo\b/g, "anjo-da-tasmânia")
    .replace(/\bouro vermelho\b/g, "ouro vermelho")
    .replace(/\bvermelho ouro\b/g, "ouro vermelho")
    .replace(/\bouro estrela\b/g, "estrela dourada")
    .replace(/\bvermelho estrela\b/g, "estrela vermelha")
    .replace(/\bvermelho raposa\b/g, "raposa vermelha")
    .replace(/\bbranco maravilha\b/g, "maravilha branca")
    .replace(/\bglória de os andes\b/g, "glória dos andes")
    .replace(/\bouro corrida\b/g, "corrida do ouro")
    .replace(/\bneve esporte\b/g, "esporte da neve")
    .replace(/\bbush’s elettra\b/g, "elettra do arbusto")
    .replace(/\bazul elettra\b/g, "elettra azul");

  return normalizeSpacing(nextName);
}

async function main(): Promise<void> {
  const plants = await Plants.findAll({ order: [["id", "ASC"]] });
  const rows = plants.map((plant) => plant.toJSON() as PlantRow);
  const updates = rows
    .map((row) => ({
      id: row.id,
      from: row.name,
      to: normalizeName(row.name),
      scientificName: row.scientificName,
    }))
    .filter((update) => update.from !== update.to);

  const backupDir = path.resolve(
    process.env.USERPROFILE || process.cwd(),
    ".codex",
    "memories",
    "ecoviewer-backups"
  );
  fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `plants-name-backup-before-portuguese-normalize-${timestamp}.json`);
  fs.writeFileSync(
    backupPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        rule: "Normalize remaining English words in plants.name only.",
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

  const [duplicates] = await sequelize.query(
    "SELECT name, COUNT(*)::int AS total FROM plants GROUP BY name HAVING COUNT(*) > 1"
  );

  console.log(`Backup: ${backupPath}`);
  console.log(`Rows updated: ${updates.length}`);
  console.log(`Remaining duplicate groups: ${duplicates.length}`);
  console.table(updates.slice(0, 80));
}

main()
  .catch((error) => {
    console.error("Error while normalizing plant names:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
