import { CategoriesEntity } from "../entity/entity.plant";

type PlantNameSource = Pick<CategoriesEntity, "name" | "nameEN" | "scientificName">;

const FAMILY_TRANSLATIONS: Record<string, string> = {
    acanthaceae: "Acantáceas",
    acoraceae: "Acoráceas",
    actinidiaceae: "Actinidiáceas",
    alismataceae: "Alismatáceas",
    alstroemeriaceae: "Alstroemeriáceas",
    altingiaceae: "Altingiáceas",
    amaranthaceae: "Amarantáceas",
    amaryllidaceae: "Amarilidáceas",
    annonaceae: "Anonáceas",
    apiaceae: "Apiáceas",
    apocynaceae: "Apocináceas",
    araceae: "Aráceas",
    araliaceae: "Araliáceas",
    araucariaceae: "Araucariáceas",
    arecaceae: "Arecáceas",
    asparagaceae: "Asparagáceas",
    asphodelaceae: "Asfodeláceas",
    asteraceae: "Asteráceas",
    betulaceae: "Betuláceas",
    bignoniaceae: "Bignoniáceas",
    brassicaceae: "Brassicáceas",
    bromeliaceae: "Bromeliáceas",
    campanulaceae: "Campanuláceas",
    caprifoliaceae: "Caprifoliáceas",
    cactaceae: "Cactáceas",
    celastraceae: "Celastráceas",
    cercidiphyllaceae: "Cercidifiláceas",
    cornaceae: "Cornáceas",
    crassulaceae: "Crassuláceas",
    cupressaceae: "Cupressáceas",
    didiereaceae: "Didiereáceas",
    ebenaceae: "Ebenáceas",
    elaeagnaceae: "Eleagnáceas",
    ericaceae: "Ericáceas",
    euphorbiaceae: "Euforbiáceas",
    fabaceae: "Fabáceas",
    fagaceae: "Fagáceas",
    gesneriaceae: "Gesneriáceas",
    ginkgoaceae: "Ginkgoáceas",
    hamamelidaceae: "Hamamelidáceas",
    hydrangeaceae: "Hortensiáceas",
    juglandaceae: "Juglandáceas",
    lamiaceae: "Lamiáceas",
    lardizabalaceae: "Lardizabaláceas",
    lauraceae: "Lauráceas",
    lythraceae: "Litráceas",
    magnoliaceae: "Magnoliáceas",
    malvaceae: "Malváceas",
    meliaceae: "Meliáceas",
    moraceae: "Moráceas",
    myrtaceae: "Mirtáceas",
    nyssaceae: "Nissáceas",
    oleaceae: "Oleáceas",
    orchidaceae: "Orquidáceas",
    orobanchaceae: "Orobancáceas",
    paulowniaceae: "Paulowniáceas",
    pinaceae: "Pináceas",
    plumbaginaceae: "Plumbagináceas",
    poaceae: "Poáceas",
    podocarpaceae: "Podocarpáceas",
    pteridaceae: "Pteridáceas",
    ranunculaceae: "Ranunculáceas",
    rosaceae: "Rosáceas",
    rubiaceae: "Rubiáceas",
    sapindaceae: "Sapindáceas",
    simaroubaceae: "Simarubáceas",
    solanaceae: "Solanáceas",
    theaceae: "Teáceas",
    verbenaceae: "Verbenáceas",
    winteraceae: "Winteráceas",
    zingiberaceae: "Zingiberáceas",
};

const EXACT_NAME_TRANSLATIONS: Record<string, string> = {
    rose: "Rosa",
    mimosa: "Mimosa",
    ginkgo: "Ginkgo",
    okra: "Quiabo",
    baobab: "Baobá",
    agave: "Agave",
    aloe: "Aloe",
    garlic: "Alho",
    onion: "Cebola",
    chives: "Cebolinha",
    leek: "Alho-poró",
    allium: "Alho-ornamental",
    yarrow: "Mil-folhas",
    ajania: "Ajânia",
    abelia: "Abélia",
    acaena: "Acaena",
    koa: "Koa",
    loquat: "Nêspera",
};

const SCIENTIFIC_NAME_TRANSLATIONS: Record<string, string> = {
    "abelia chinensis": "Abélia-chinesa",
    "abelia grandiflora": "Abélia-brilhante",
    "abeliophyllum distichum": "Forsítia-branca",
    "abelmoschus esculentus": "Quiabo",
    "abelmoschus manihot": "Malva-do-sol",
    "abelmoschus moschatus": "Malva-almiscarada",
    "abies alba": "Abeto-prateado",
    "abies balsamea": "Abeto-balsâmico",
    "abies concolor": "Abeto-branco",
    "abies fraseri": "Abeto-de-fraser",
    "abies koreana": "Abeto-coreano",
    "abies lasiocarpa": "Abeto-alpino",
    "abies nordmanniana": "Abeto-do-cáucaso",
    "abies pinsapo": "Abeto-espanhol",
    "abies procera": "Abeto-nobre",
    "acacia koa": "Acácia-koa",
    "acalypha hispida": "Rabo-de-gato",
    "acalypha wilkesiana": "Acalifa",
    "acantha mollis": "Acanto",
    "acanthus mollis": "Acanto",
    "acanthus spinosus": "Acanto-espinhoso",
    "acca sellowiana": "Goiabeira-serrana",
    "acer palmatum": "Bordo-japonês",
    "acer japonicum": "Bordo-da-lua-cheia",
    "acer rubrum": "Bordo-vermelho",
    "acer saccharum": "Bordo-açucareiro",
    "achillea millefolium": "Mil-folhas",
    "aconitum napellus": "Acônito",
    "acorus calamus": "Cálamo-aromático",
    "actinidia deliciosa": "Kiwi",
    "adansonia digitata": "Baobá",
    "adenium obesum": "Rosa-do-deserto",
    "adiantum capillus-veneris": "Avenca",
    "aechmea fasciata": "Bromélia-prateada",
    "aesculus hippocastanum": "Castanheiro-da-índia",
    "agapanthus africanus": "Agapanto-africano",
    "agave americana": "Pita",
    "ageratum houstonianum": "Agerato",
    "aglaonema commutatum": "Aglaonema",
    "ajuga reptans": "Ajuga",
    "akebia quinata": "Aquébia",
    "albizia julibrissin": "Albízia",
    "albizia saman": "Árvore-da-chuva",
    "alcea rosea": "Malva-rosa",
    "alchemilla mollis": "Alquimila",
    "allamanda schottii": "Alamanda-arbustiva",
    "allium cepa": "Cebola",
    "allium sativum": "Alho",
    "allium schoenoprasum": "Cebolinha",
    "alnus glutinosa": "Amieiro-europeu",
    "alocasia amazonica": "Alocásia-amazônica",
    "aloe vera": "Babosa",
    "aloysia citriodora": "Lúcia-lima",
    "aloysia virgata": "Aloísia-arbustiva",
    "alpinia galanga": "Galanga",
    "alpinia zerumbet": "Colônia",
    "alstroemeria aurea": "Astromélia",
    "althaea officinalis": "Alteia",
    "araucaria araucana": "Araucária-do-chile",
    "arbutus unedo": "Medronheiro",
    "asaphodelaceae": "Asfodeláceas",
    "asimina triloba": "Pawpaw",
    "betula nigra": "Bétula-de-rio",
    "betula papyrifera": "Bétula-do-papel",
    "calocedrus decurrens": "Cedro-incenso",
    "carpinus betulus": "Carpino-europeu",
    "carpinus japonica": "Carpino-japonês",
    "catalpa bignonioides": "Catalpa",
    "cedrus deodara": "Cedro-do-himalaia",
    "cedrus libani": "Cedro-do-líbano",
    "cercidiphyllum japonicum": "Árvore-katsura",
    "cercis canadensis": "Árvore-de-judas-americana",
    "chamaecyparis obtusa": "Falso-cipreste-hinoki",
    "chionanthus retusus": "Árvore-da-neve-chinesa",
    "chionanthus virginicus": "Árvore-da-neve",
    "cornus florida": "Corniso-florido",
    "cornus kousa": "Corniso-japonês",
    "cornus mas": "Corniso-cereja",
    "cryptomeria japonica": "Criptoméria",
    "davidia involucrata": "Árvore-dos-lenços",
    "diospyros kaki": "Caquizeiro",
    "diospyros virginiana": "Caquizeiro-americano",
    "eriobotrya japonica": "Nespereira",
    "euonymus europaeus": "Evônimo-europeu",
    "fagus sylvatica": "Faia-europeia",
    "ficus carica": "Figueira",
    "fraxinus nigra": "Freixo-negro",
    "ginkgo biloba": "Ginkgo",
    "hydrangea paniculata": "Hortênsia-paniculada",
    "juglans regia": "Nogueira-europeia",
    "koelreuteria paniculata": "Árvore-da-chuva-dourada",
    "lagerstroemia indica": "Resedá",
    "laurus nobilis": "Louro",
    "liquidambar styraciflua": "Liquidâmbar",
    "liriodendron tulipifera": "Tulipeiro",
    "magnolia grandiflora": "Magnólia-branca",
    "magnolia kobus": "Magnólia-kobus",
    "malus": "Macieira",
    "metasequoia glyptostroboides": "Metassequoia",
    "olea europaea": "Oliveira",
    "paulownia tomentosa": "Paulônia",
    "picea abies": "Pícea-da-noruega",
    "rosa": "Rosa",
};

const GENUS_NAME_TRANSLATIONS: Record<string, string> = {
    abelia: "Abélia",
    abutilon: "Lanterninha-japonesa",
    acacia: "Acácia",
    acaena: "Acaena",
    acalypha: "Acalifa",
    acantholimon: "Acantolimão",
    acanthus: "Acanto",
    acer: "Bordo",
    achillea: "Mil-folhas",
    achimenes: "Aquimenes",
    aciphylla: "Acifila",
    acoelorrhaphe: "Palmeira-paurotis",
    aconitum: "Acônito",
    acorus: "Cálamo",
    actaea: "Cimicífuga",
    actinidia: "Kiwi",
    adansonia: "Baobá",
    adenium: "Rosa-do-deserto",
    adenophora: "Campainha",
    adiantum: "Avenca",
    adina: "Adina",
    adonidia: "Palmeira-de-manila",
    aechmea: "Bromélia",
    aegopodium: "Erva-dos-bispos",
    aeonium: "Aeônio",
    aeschynanthus: "Planta-batom",
    aesculus: "Castanheiro-da-índia",
    afrocarpus: "Podocarpo-africano",
    agalinis: "Agalinis",
    agapanthus: "Agapanto",
    agastache: "Agastache",
    agave: "Agave",
    ageratina: "Ageratina",
    ageratum: "Agerato",
    aglaia: "Aglaia",
    aglaonema: "Aglaonema",
    agrostis: "Capim-agrostis",
    ailanthus: "Ailanto",
    ajania: "Ajânia",
    ajuga: "Ajuga",
    akebia: "Aquébia",
    alangium: "Alângio",
    albizia: "Albízia",
    alcea: "Malva-rosa",
    alchemilla: "Alquimila",
    aleurites: "Tungue",
    alisma: "Alisma",
    allamanda: "Alamanda",
    allium: "Alho-ornamental",
    alluaudia: "Aluaudia",
    alnus: "Amieiro",
    alocasia: "Alocásia",
    aloe: "Babosa",
    aloysia: "Aloísia",
    alpinia: "Alpínia",
    alstroemeria: "Astromélia",
    alternanthera: "Alternantera",
    althaea: "Alteia",
    alyssum: "Álisso",
    aralia: "Arália",
    araucaria: "Araucária",
    arbutus: "Medronheiro",
    asimina: "Asimina",
    betula: "Bétula",
    calocedrus: "Cedro-incenso",
    carpinus: "Carpino",
    catalpa: "Catalpa",
    cedrus: "Cedro",
    cercidiphyllum: "Árvore-katsura",
    cercis: "Árvore-de-judas",
    chamaecyparis: "Falso-cipreste",
    chionanthus: "Árvore-da-neve",
    clerodendrum: "Clerodendro",
    cordyline: "Cordiline",
    cornus: "Corniso",
    crataegus: "Pilriteiro",
    cryptomeria: "Criptoméria",
    davidia: "Árvore-dos-lenços",
    diospyros: "Caquizeiro",
    drimys: "Pimenteira",
    elaeagnus: "Eleagno",
    eriobotrya: "Nespereira",
    euonymus: "Evônimo",
    fagus: "Faia",
    ficus: "Figueira",
    franklinia: "Franklínia",
    fraxinus: "Freixo",
    ginkgo: "Ginkgo",
    gleditsia: "Gledítsia",
    hippophae: "Espinheiro-marítimo",
    hydrangea: "Hortênsia",
    juglans: "Nogueira",
    juniperus: "Zimbro",
    koelreuteria: "Árvore-da-chuva-dourada",
    lagerstroemia: "Resedá",
    laurus: "Louro",
    liquidambar: "Liquidâmbar",
    liriodendron: "Tulipeiro",
    magnolia: "Magnólia",
    malus: "Macieira",
    metasequoia: "Metassequoia",
    nyssa: "Nissa",
    olea: "Oliveira",
    parrotia: "Parrótia",
    paulownia: "Paulônia",
    picea: "Pícea",
};

const PHRASE_TRANSLATIONS: Array<[RegExp, string]> = [
    [/\bjapanese maple\b/gi, "bordo-japonês"],
    [/\bnorway maple\b/gi, "bordo-da-noruega"],
    [/\bsycamore maple\b/gi, "bordo-sicômoro"],
    [/\bkorean maple\b/gi, "bordo-coreano"],
    [/\bred maple\b/gi, "bordo-vermelho"],
    [/\bsugar maple\b/gi, "bordo-açucareiro"],
    [/\bsilver maple\b/gi, "bordo-prateado"],
    [/\bfullmoon maple\b/gi, "bordo-da-lua-cheia"],
    [/\bfull moon maple\b/gi, "bordo-da-lua-cheia"],
    [/\bsnakebark maple\b/gi, "bordo-de-casca-listrada"],
    [/\bpaperbark maple\b/gi, "bordo-de-casca-papirácea"],
    [/\bbig leaf maple\b/gi, "bordo-de-folhas-grandes"],
    [/\bmaple\b/gi, "bordo"],
    [/\bboxelder\b/gi, "bordo-negundo"],
    [/\bsilver fir\b/gi, "abeto-prateado"],
    [/\bwhite fir\b/gi, "abeto-branco"],
    [/\bfraser fir\b/gi, "abeto-de-fraser"],
    [/\bkorean fir\b/gi, "abeto-coreano"],
    [/\balpine fir\b/gi, "abeto-alpino"],
    [/\bspanish fir\b/gi, "abeto-espanhol"],
    [/\bnoble fir\b/gi, "abeto-nobre"],
    [/\bbalsam fir\b/gi, "abeto-balsâmico"],
    [/\bgrand fir\b/gi, "abeto-gigante"],
    [/\bcaucasian fir\b/gi, "abeto-do-cáucaso"],
    [/\bmomi fir\b/gi, "abeto-momi"],
    [/\bfir\b/gi, "abeto"],
    [/\bdeodar cedar\b/gi, "cedro-do-himalaia"],
    [/\bcedar of lebanon\b/gi, "cedro-do-líbano"],
    [/\batlas cedar\b/gi, "cedro-do-atlas"],
    [/\bjapanese cedar\b/gi, "cedro-japonês"],
    [/\bincense cedar\b/gi, "cedro-incenso"],
    [/\bcedar\b/gi, "cedro"],
    [/\bfalsecypress\b/gi, "falso-cipreste"],
    [/\bwhitecedar\b/gi, "cedro-branco"],
    [/\bspruce\b/gi, "abeto-vermelho"],
    [/\bjuniper\b/gi, "zimbro"],
    [/\bhornbeam\b/gi, "carpino"],
    [/\bbirch\b/gi, "bétula"],
    [/\bpaper birch\b/gi, "bétula-do-papel"],
    [/\bbeech\b/gi, "faia"],
    [/\balder\b/gi, "amieiro"],
    [/\bdogwood\b/gi, "corniso"],
    [/\bhawthorn\b/gi, "pilriteiro"],
    [/\bpersimmon\b/gi, "caqui"],
    [/\bfig\b/gi, "figueira"],
    [/\bwalnut\b/gi, "nogueira"],
    [/\bolive\b/gi, "oliveira"],
    [/\bmagnolia\b/gi, "magnólia"],
    [/\bapple\b/gi, "macieira"],
    [/\bcrab\b/gi, "macieira-ornamental"],
    [/\bhydrangea\b/gi, "hortênsia"],
    [/\btuliptree\b/gi, "tulipeiro"],
    [/\bsweet gum\b/gi, "liquidâmbar"],
    [/\bfern\b/gi, "samambaia"],
    [/\bpalm\b/gi, "palmeira"],
    [/\bagave\b/gi, "agave"],
    [/\baloe\b/gi, "aloe"],
    [/\blily of the nile\b/gi, "agapanto"],
    [/\bafrican lily\b/gi, "agapanto-africano"],
    [/\bgiant hyssop\b/gi, "agastache"],
    [/\banise hyssop\b/gi, "agastache-anisado"],
    [/\bhyssop\b/gi, "hissopo"],
    [/\belephant's ear\b/gi, "orelha-de-elefante"],
    [/\blily of the incas\b/gi, "astromélia"],
    [/\binca lily\b/gi, "astromélia"],
    [/\bornamental onion\b/gi, "alho-ornamental"],
    [/\bgarlic chives\b/gi, "cebolinha-chinesa"],
    [/\bscallion\b/gi, "cebolinha"],
    [/\bgarlic\b/gi, "alho"],
    [/\bonion\b/gi, "cebola"],
    [/\byarrow\b/gi, "mil-folhas"],
    [/\bmonkshood\b/gi, "acônito"],
    [/\bsweet flag\b/gi, "cálamo-aromático"],
    [/\bbugleweed\b/gi, "ajuga"],
    [/\bcommon bugle\b/gi, "ajuga"],
    [/\bhollyhock\b/gi, "malva-rosa"],
    [/\blady's mantle\b/gi, "alquimila"],
    [/\bdesert rose\b/gi, "rosa-do-deserto"],
    [/\bpineapple guava\b/gi, "goiabeira-serrana"],
    [/\blemon verbena\b/gi, "lúcia-lima"],
    [/\bbay laurel\b/gi, "louro"],
    [/\btree of heaven\b/gi, "ailanto"],
];

const ADJECTIVE_TRANSLATIONS: Array<[RegExp, string]> = [
    [/\bamerican\b/gi, "americano"],
    [/\bafrican\b/gi, "africano"],
    [/\balpine\b/gi, "alpino"],
    [/\bamur\b/gi, "de-amur"],
    [/\bappalachian\b/gi, "dos-apalaches"],
    [/\bautumn\b/gi, "de-outono"],
    [/\bazure\b/gi, "azul"],
    [/\bbig\b/gi, "grande"],
    [/\bblack\b/gi, "preto"],
    [/\bblue\b/gi, "azul"],
    [/\bbottlebrush\b/gi, "escova-de-garrafa"],
    [/\bbrazilian\b/gi, "brasileiro"],
    [/\bcalifornia\b/gi, "da-califórnia"],
    [/\bcalifornian\b/gi, "californiano"],
    [/\bcape\b/gi, "do-cabo"],
    [/\bcarpathian\b/gi, "dos-cárpatos"],
    [/\bcaucasian\b/gi, "do-cáucaso"],
    [/\bchinese\b/gi, "chinês"],
    [/\bclimbing\b/gi, "trepador"],
    [/\bcoastal\b/gi, "costeiro"],
    [/\bcolumnar\b/gi, "colunar"],
    [/\bcommon\b/gi, "comum"],
    [/\bcompact\b/gi, "compacto"],
    [/\bcoral\b/gi, "coral"],
    [/\bcrimson\b/gi, "carmesim"],
    [/\bcutleaf\b/gi, "de-folhas-recortadas"],
    [/\bdwarf\b/gi, "anão"],
    [/\beastern\b/gi, "oriental"],
    [/\beuropean\b/gi, "europeu"],
    [/\bflowering\b/gi, "florífero"],
    [/\bgerman\b/gi, "alemão"],
    [/\bgiant\b/gi, "gigante"],
    [/\bgolden\b/gi, "dourado"],
    [/\bgreen\b/gi, "verde"],
    [/\bgrey\b/gi, "cinzento"],
    [/\bhardy\b/gi, "rústico"],
    [/\bhedge\b/gi, "de-cerca-viva"],
    [/\bhimalayan\b/gi, "do-himalaia"],
    [/\bindian\b/gi, "indiano"],
    [/\bitalian\b/gi, "italiano"],
    [/\bjapanese\b/gi, "japonês"],
    [/\bkorean\b/gi, "coreano"],
    [/\blarge\b/gi, "grande"],
    [/\blemon\b/gi, "limão"],
    [/\bmountain\b/gi, "da-montanha"],
    [/\bnorthern\b/gi, "do-norte"],
    [/\bornamental\b/gi, "ornamental"],
    [/\bpacific\b/gi, "do-pacífico"],
    [/\bpaper\b/gi, "do-papel"],
    [/\bpersian\b/gi, "persa"],
    [/\bpink\b/gi, "rosa"],
    [/\bprairie\b/gi, "da-pradaria"],
    [/\bpurple\b/gi, "roxo"],
    [/\bred\b/gi, "vermelho"],
    [/\briver\b/gi, "de-rio"],
    [/\bround-headed\b/gi, "de-cabeça-arredondada"],
    [/\brussian\b/gi, "russo"],
    [/\bsea\b/gi, "marinho"],
    [/\bseaside\b/gi, "litorâneo"],
    [/\bslenderleaf\b/gi, "de-folhas-estreitas"],
    [/\bsouthern\b/gi, "do-sul"],
    [/\bspanish\b/gi, "espanhol"],
    [/\bvariegated\b/gi, "variegado"],
    [/\bweeping\b/gi, "pendente"],
    [/\bwhite\b/gi, "branco"],
    [/\bwild\b/gi, "silvestre"],
    [/\byellow\b/gi, "amarelo"],
];

export function getTranslatedFamilyName(family?: string | null): string {
    const normalizedFamily = normalizeLookupKey(family);
    return normalizedFamily ? FAMILY_TRANSLATIONS[normalizedFamily] ?? family!.trim() : "";
}

export function normalizeFamilyName(family: string): string {
    return getTranslatedFamilyName(family).trim().toLowerCase();
}

export function getTranslatedPlantName(plant: PlantNameSource): string {
    const englishName = getOriginalEnglishName(plant);
    const scientificNameTranslation = getTranslatedPlantNameFromScientificName(plant.scientificName);

    if (scientificNameTranslation) {
        return scientificNameTranslation;
    }

    const exactTranslation = EXACT_NAME_TRANSLATIONS[normalizeLookupKey(englishName)];

    if (exactTranslation) {
        return exactTranslation;
    }

    let translatedName = englishName;
    const cultivarSuffix = getCultivarSuffix(plant.scientificName);
    const nameForTranslation = removeLeadingCultivarName(englishName, cultivarSuffix);
    translatedName = nameForTranslation;

    for (const [pattern, replacement] of PHRASE_TRANSLATIONS) {
        translatedName = translatedName.replace(pattern, replacement);
    }

    for (const [pattern, replacement] of ADJECTIVE_TRANSLATIONS) {
        translatedName = translatedName.replace(pattern, replacement);
    }

    translatedName = cleanupTranslatedName(translatedName);

    if (cultivarSuffix && !translatedName.toLowerCase().includes(cultivarSuffix.toLowerCase())) {
        translatedName = `${translatedName} ${formatCultivarForDisplay(cultivarSuffix)}`;
    }

    return translatedName || englishName;
}

export function getOriginalEnglishName(plant: PlantNameSource): string {
    return plant.nameEN?.trim() || plant.name?.trim() || "Unknown plant";
}

export function replaceEnglishMentionsInDescription(
    description: string | null | undefined,
    englishName: string,
    portugueseName: string,
    englishFamily: string,
    portugueseFamily: string
): string | null {
    if (!description) {
        return description ?? null;
    }

    return description
        .split(englishName).join(portugueseName)
        .split(englishFamily).join(portugueseFamily);
}

function getCultivarSuffix(scientificName?: string | null): string | undefined {
    const cultivar = scientificName?.match(/'(.+)'/)?.[1]?.trim();
    return cultivar || undefined;
}

function formatCultivarForDisplay(cultivarName: string): string {
    return cultivarName
        .replace(/\(tree form\)/gi, "forma arbórea")
        .replace(/\btree form\b/gi, "forma arbórea")
        .replace(/\bSummer Beauty\b/gi, "Beleza-do-verão")
        .replace(/\bOak Leaf\b/gi, "Folha-de-carvalho")
        .replace(/\bTasmanian Angel\b/gi, "Anjo-da-tasmânia")
        .replace(/\bBlue Star\b/gi, "Estrela-azul")
        .replace(/\bBlue Chip\b/gi, "Azul-compacto")
        .replace(/\bBlue Shadow\b/gi, "Sombra-azul")
        .replace(/\bBlue Boa\b/gi, "Boa-azul")
        .replace(/\bBlue Fortune\b/gi, "Fortuna-azul")
        .replace(/\bBlue Yonder\b/gi, "Azul-distante")
        .replace(/\bRed Gold\b/gi, "Vermelho-dourado")
        .replace(/\bRed Star\b/gi, "Estrela-vermelha")
        .replace(/\bRed Select\b/gi, "Seleção-vermelha")
        .replace(/\bGreen Cascade\b/gi, "Cascata-verde")
        .replace(/\bGreen Mountain\b/gi, "Montanha-verde")
        .replace(/\bGreen Prince\b/gi, "Príncipe-verde")
        .replace(/\bGolden Jubilee\b/gi, "Jubileu-dourado")
        .replace(/\bGold Dust\b/gi, "Pó-de-ouro")
        .replace(/\bGold Rush\b/gi, "Corrida-do-ouro")
        .replace(/\bGold Star\b/gi, "Estrela-dourada")
        .replace(/\bPink Diamond\b/gi, "Diamante-rosa")
        .replace(/\bPink Spire\b/gi, "Espiga-rosa")
        .replace(/\bPurple Haze\b/gi, "Névoa-roxa")
        .replace(/\bPurple Brocade\b/gi, "Brocado-roxo")
        .replace(/\bPurple Torch\b/gi, "Tocha-roxa")
        .replace(/\bPurple Sensation\b/gi, "Sensação-roxa")
        .replace(/\bSilver Beauty\b/gi, "Beleza-prateada")
        .replace(/\bWhite Pearl\b/gi, "Pérola-branca")
        .replace(/\bCold Hardy White\b/gi, "Branco-rústico")
        .replace(/\bArctic Beauty\b/gi, "Beleza-ártica")
        .replace(/\bBlack Beauty\b/gi, "Beleza-negra")
        .replace(/\bBlack Negligee\b/gi, "Negligê-negro")
        .replace(/\bBlack Adder\b/gi, "Víbora-negra")
        .replace(/\bBella Red\b/gi, "Bela-vermelha")
        .replace(/\bKingston Blue\b/gi, "Azul-kingston")
        .replace(/\bSummer Skies\b/gi, "Céu-de-verão")
        .replace(/\bSummer Breeze\b/gi, "Brisa-de-verão")
        .replace(/\bSummer Love\b/gi, "Amor-de-verão")
        .replace(/\bSummer Chocolate\b/gi, "Chocolate-de-verão")
        .replace(/\bBush's Electra\b/gi, "Electra")
        .replace(/\bKelly's Gold\b/gi, "Ouro-de-kelly")
        .replace(/\bHearts of Gold\b/gi, "Corações-de-ouro")
        .replace(/\bTeddy Bear\b/gi, "Urso-de-pelúcia")
        .replace(/\bHoney Bee Blue\b/gi, "Azul-abelha")
        .replace(/\bGarden Leader Blue\b/gi, "Azul-de-jardim")
        .replace(/\bPacific Sunset Dark Pink\b/gi, "Pôr-do-sol-rosa")
        .replace(/\bDark Pink\b/gi, "Rosa-escuro")
        .replace(/\bMoonchimes\b/gi, "Sinos-da-lua")
        .replace(/\bLimelight\b/gi, "Luz-limão")
        .replace(/\bNana\b/gi, "Anã")
        .replace(/\s+/g, " ")
        .trim();
}

function getTranslatedPlantNameFromScientificName(scientificName?: string | null): string | undefined {
    const normalizedScientificName = normalizeScientificName(scientificName);

    if (!normalizedScientificName) {
        return undefined;
    }

    const cultivarSuffix = getCultivarSuffix(scientificName);
    const exactTranslation = SCIENTIFIC_NAME_TRANSLATIONS[normalizedScientificName];
    const genus = normalizedScientificName.split(" ")[0];
    const genusTranslation = GENUS_NAME_TRANSLATIONS[genus];
    const translatedBaseName = exactTranslation ?? genusTranslation;

    if (!translatedBaseName) {
        return undefined;
    }

    if (cultivarSuffix && !translatedBaseName.toLowerCase().includes(cultivarSuffix.toLowerCase())) {
        return `${translatedBaseName} ${formatCultivarForDisplay(cultivarSuffix)}`;
    }

    return translatedBaseName;
}

function removeLeadingCultivarName(name: string, cultivarName?: string): string {
    if (!cultivarName) {
        return name;
    }

    const cultivarFirstWord = cultivarName.split(/\s+/)[0];
    const leadingCultivarPattern = new RegExp(`^${escapeRegExp(cultivarFirstWord)}\\s+`, "i");

    return name.replace(leadingCultivarPattern, "").trim() || name;
}

function cleanupTranslatedName(value: string): string {
    return value
        .replace(/\*/g, "")
        .replace(/\s+/g, " ")
        .replace(/\s+\)/g, ")")
        .replace(/\(\s+/g, "(")
        .trim()
        .replace(/^./, (letter) => letter.toUpperCase());
}

function normalizeLookupKey(value?: string | null): string {
    return value?.trim().toLowerCase() ?? "";
}

function normalizeScientificName(value?: string | null): string {
    return value
        ?.replace(/'[^']+'/g, "")
        .replace(/\([^)]*\)/g, "")
        .replace(/\b(group|subsp\.|var\.|f\.)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase() ?? "";
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
