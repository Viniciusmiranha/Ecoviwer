import { CategoriesEntity } from "../entity/entity.plant";

type PlantDescriptionSource = Pick<CategoriesEntity, "name" | "scientificName" | "family">;

type FamilyDescriptionProfile = {
    subject: string;
    trait: string;
    value: string;
};

const FAMILY_PROFILES: Record<string, FamilyDescriptionProfile> = {
    pináceas: {
        subject: "uma conífera ornamental",
        trait: "caracterizada pelo hábito lenhoso e pela folhagem geralmente persistente, formada por folhas estreitas ou em forma de agulha",
        value: "Sua estrutura arquitetônica contribui para jardins de clima temperado, coleções botânicas e composições paisagísticas com forte presença visual.",
    },
    pinaceae: {
        subject: "uma conífera ornamental",
        trait: "caracterizada pelo hábito lenhoso e pela folhagem geralmente persistente, formada por folhas estreitas ou em forma de agulha",
        value: "Sua estrutura arquitetônica contribui para jardins de clima temperado, coleções botânicas e composições paisagísticas com forte presença visual.",
    },
    rosaceae: {
        subject: "uma planta",
        trait: "grupo botânico que reúne espécies ornamentais e frutíferas de grande relevância em jardins, pomares e coleções vegetais",
        value: "Sua identificação taxonômica auxilia no reconhecimento de características florais, frutificação e uso ornamental conforme a espécie.",
    },
    rosáceas: {
        subject: "uma planta",
        trait: "grupo botânico que reúne espécies ornamentais e frutíferas de grande relevância em jardins, pomares e coleções vegetais",
        value: "Sua identificação taxonômica auxilia no reconhecimento de características florais, frutificação e uso ornamental conforme a espécie.",
    },
    sapindaceae: {
        subject: "uma planta",
        trait: "família que reúne árvores, arbustos e trepadeiras com diversidade de folhas, flores e frutos",
        value: "Sua classificação botânica ajuda a compreender o porte, a textura da folhagem e o potencial paisagístico conforme a espécie.",
    },
    sapindáceas: {
        subject: "uma planta",
        trait: "família que reúne árvores, arbustos e trepadeiras com diversidade de folhas, flores e frutos",
        value: "Sua classificação botânica ajuda a compreender o porte, a textura da folhagem e o potencial paisagístico conforme a espécie.",
    },
    asteraceae: {
        subject: "uma planta",
        trait: "grupo reconhecido pela presença de inflorescências compostas e ampla diversidade de formas ornamentais",
        value: "Pode se destacar em jardins e coleções pela floração, textura da folhagem ou hábito de crescimento próprio da espécie.",
    },
    asteráceas: {
        subject: "uma planta",
        trait: "grupo reconhecido pela presença de inflorescências compostas e ampla diversidade de formas ornamentais",
        value: "Pode se destacar em jardins e coleções pela floração, textura da folhagem ou hábito de crescimento próprio da espécie.",
    },
    lamiaceae: {
        subject: "uma planta",
        trait: "família associada a espécies aromáticas, ornamentais e herbáceas ou arbustivas de interesse botânico",
        value: "Sua presença em jardins costuma estar ligada à textura da folhagem, à floração e ao valor ornamental do grupo.",
    },
    lamiáceas: {
        subject: "uma planta",
        trait: "família associada a espécies aromáticas, ornamentais e herbáceas ou arbustivas de interesse botânico",
        value: "Sua presença em jardins costuma estar ligada à textura da folhagem, à floração e ao valor ornamental do grupo.",
    },
    poaceae: {
        subject: "uma gramínea",
        trait: "caracterizada por folhas estreitas e hábito de crescimento típico das gramíneas",
        value: "Sua textura linear pode contribuir para bordaduras, maciços, jardins naturalistas e composições paisagísticas de aspecto leve.",
    },
    poáceas: {
        subject: "uma gramínea",
        trait: "caracterizada por folhas estreitas e hábito de crescimento típico das gramíneas",
        value: "Sua textura linear pode contribuir para bordaduras, maciços, jardins naturalistas e composições paisagísticas de aspecto leve.",
    },
    fabaceae: {
        subject: "uma planta",
        trait: "grupo botânico amplo, conhecido por grande diversidade de formas, folhas compostas e flores de interesse ornamental",
        value: "Sua identificação familiar auxilia na compreensão do porte, da floração e do uso paisagístico conforme a espécie.",
    },
    fabáceas: {
        subject: "uma planta",
        trait: "grupo botânico amplo, conhecido por grande diversidade de formas, folhas compostas e flores de interesse ornamental",
        value: "Sua identificação familiar auxilia na compreensão do porte, da floração e do uso paisagístico conforme a espécie.",
    },
    arecaceae: {
        subject: "uma palmeira",
        trait: "reconhecida pelo porte elegante e pela disposição característica das folhas",
        value: "É valorizada em paisagismo pela verticalidade, textura tropical e capacidade de estruturar composições ao ar livre ou em interiores amplos.",
    },
    arecáceas: {
        subject: "uma palmeira",
        trait: "reconhecida pelo porte elegante e pela disposição característica das folhas",
        value: "É valorizada em paisagismo pela verticalidade, textura tropical e capacidade de estruturar composições ao ar livre ou em interiores amplos.",
    },
    cactaceae: {
        subject: "uma cactácea",
        trait: "marcada por adaptações a ambientes secos, como caules suculentos e folhas reduzidas",
        value: "Sua morfologia escultural favorece o uso em coleções, jardins xerófitos e composições ornamentais de baixa demanda hídrica.",
    },
    cactáceas: {
        subject: "uma cactácea",
        trait: "marcada por adaptações a ambientes secos, como caules suculentos e folhas reduzidas",
        value: "Sua morfologia escultural favorece o uso em coleções, jardins xerófitos e composições ornamentais de baixa demanda hídrica.",
    },
    crassulaceae: {
        subject: "uma suculenta",
        trait: "caracterizada pelo armazenamento de água em folhas ou caules de textura carnosa",
        value: "Sua forma compacta e expressiva a torna valorizada em vasos, coleções e jardins ornamentais com manejo hídrico moderado.",
    },
    crassuláceas: {
        subject: "uma suculenta",
        trait: "caracterizada pelo armazenamento de água em folhas ou caules de textura carnosa",
        value: "Sua forma compacta e expressiva a torna valorizada em vasos, coleções e jardins ornamentais com manejo hídrico moderado.",
    },
    orchidaceae: {
        subject: "uma orquídea",
        trait: "grupo botânico reconhecido pela diversidade floral e por estruturas reprodutivas especializadas",
        value: "É apreciada em coleções e cultivo ornamental pela complexidade das flores e pela variedade de formas presentes no grupo.",
    },
    orquidáceas: {
        subject: "uma orquídea",
        trait: "grupo botânico reconhecido pela diversidade floral e por estruturas reprodutivas especializadas",
        value: "É apreciada em coleções e cultivo ornamental pela complexidade das flores e pela variedade de formas presentes no grupo.",
    },
    moraceae: {
        subject: "uma planta",
        trait: "família que inclui espécies arbóreas, arbustivas e ornamentais de folhagem expressiva",
        value: "Sua identificação botânica contribui para avaliar porte, textura foliar e aplicação paisagística conforme a espécie.",
    },
    moráceas: {
        subject: "uma planta",
        trait: "família que inclui espécies arbóreas, arbustivas e ornamentais de folhagem expressiva",
        value: "Sua identificação botânica contribui para avaliar porte, textura foliar e aplicação paisagística conforme a espécie.",
    },
    araceae: {
        subject: "uma planta ornamental",
        trait: "grupo conhecido pela folhagem marcante e por inflorescências características",
        value: "Sua presença é valorizada em interiores, jardins tropicais e composições de folhagem quando as condições de cultivo são adequadas.",
    },
    aráceas: {
        subject: "uma planta ornamental",
        trait: "grupo conhecido pela folhagem marcante e por inflorescências características",
        value: "Sua presença é valorizada em interiores, jardins tropicais e composições de folhagem quando as condições de cultivo são adequadas.",
    },
    asparagaceae: {
        subject: "uma planta",
        trait: "grupo que reúne espécies ornamentais de formas variadas, muitas delas apreciadas pela folhagem estrutural",
        value: "Sua morfologia pode contribuir para composições paisagísticas, vasos e jardins com leitura visual bem definida.",
    },
    asparagáceas: {
        subject: "uma planta",
        trait: "grupo que reúne espécies ornamentais de formas variadas, muitas delas apreciadas pela folhagem estrutural",
        value: "Sua morfologia pode contribuir para composições paisagísticas, vasos e jardins com leitura visual bem definida.",
    },
    nephrolepidaceae: {
        subject: "uma samambaia ornamental",
        trait: "valorizada pela folhagem densa, delicada e de textura leve",
        value: "Seu aspecto natural favorece o uso em varandas, interiores bem iluminados e áreas sombreadas com boa umidade.",
    },
};

export function hasPlantDescription(description?: string | null): boolean {
    return Boolean(description?.trim());
}

export function buildPlantDescription(plant: PlantDescriptionSource): string {
    const commonName = getDisplayName(plant);
    const scientificName = normalizeText(plant.scientificName);
    const family = normalizeText(plant.family);
    const familyProfile = family ? FAMILY_PROFILES[family.toLowerCase()] : undefined;

    if (scientificName && commonName && family && familyProfile) {
        return `${scientificName}, conhecida como ${commonName}, é ${familyProfile.subject} da família ${family}, ${familyProfile.trait}. ${familyProfile.value}`;
    }

    if (scientificName && commonName && family) {
        return `${scientificName}, conhecida como ${commonName}, pertence à família ${family}, uma classificação importante para sua identificação botânica. Sua descrição ornamental e ecológica deve considerar o porte, a folhagem, a floração e as particularidades da espécie.`;
    }

    if (scientificName && commonName) {
        return `${scientificName}, conhecida como ${commonName}, é uma planta identificada por sua nomenclatura científica, o que permite maior precisão em cultivo, estudo e organização botânica. Suas características ornamentais devem ser descritas conforme dados específicos da espécie.`;
    }

    if (scientificName && family) {
        return `${scientificName} pertence à família ${family}, informação essencial para seu reconhecimento taxonômico. A observação do porte, da folhagem e da floração complementa sua identificação botânica e seu potencial ornamental.`;
    }

    if (commonName && family) {
        return `${commonName} pertence à família ${family}, grupo botânico que reúne espécies com características vegetativas e reprodutivas relacionadas. Sua descrição deve considerar o porte, a folhagem, a floração e o uso ornamental conforme os dados disponíveis.`;
    }

    if (scientificName) {
        return `${scientificName} é uma planta identificada por sua nomenclatura científica, o que favorece precisão em estudos, cultivo e organização botânica. Suas características devem ser avaliadas conforme os dados específicos da espécie ou cultivar.`;
    }

    if (commonName) {
        return `${commonName} é uma planta de interesse botânico e ornamental associada ao seu grupo vegetal. Suas características devem ser observadas conforme a espécie ou cultivar correspondente.`;
    }

    return "Planta de interesse botânico, descrita de forma segura a partir das informações taxonômicas disponíveis.";
}

function getDisplayName(plant: PlantDescriptionSource): string | undefined {
    const name = normalizeText(plant.name);

    if (!name || name.toLowerCase() === "unknown plant") {
        return undefined;
    }

    return name;
}

function normalizeText(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue || undefined;
}
