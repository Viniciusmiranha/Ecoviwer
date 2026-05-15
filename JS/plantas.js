let currentFamily = "";
let currentPlants = [];
let currentSelectedPlantId = 0;

const perPage = 1000;

const familyTitle = document.getElementById("familyTitle");
const plantsCount = document.getElementById("plantsCount");
const plantsLoading = document.getElementById("plantsLoading");
const plantsError = document.getElementById("plantsError");
const plantsList = document.getElementById("plantsList");
const plantImageBox = document.getElementById("plantImageBox");
const plantTitle = document.getElementById("plantTitle");
const scientificName = document.getElementById("scientificName");
const plantFamily = document.getElementById("plantFamily");
const plantDescription = document.getElementById("plantDescription");
const plantDetails = document.getElementById("plantDetails");

const FAMILY_DETAIL_PROFILES = {
  "acantaceas": {
    habit: "Herbáceas e arbustos ornamentais, muitas vezes cultivados pela folhagem e floração.",
    light: "Meia-sombra ou sol filtrado.",
    watering: "Rega regular, mantendo o substrato levemente úmido sem encharcar.",
    soil: "Solo rico em matéria orgânica e com boa drenagem.",
    diseases: ["oídio", "manchas foliares", "cochonilhas", "pulgões"],
    attention: "Observe folhas amareladas e queda de folhas, sinais comuns de excesso de água ou pouca luz.",
  },
  "araceas": {
    habit: "Plantas tropicais de folhagem marcante, muito usadas em interiores e jardins sombreados.",
    light: "Luz indireta forte ou meia-sombra.",
    watering: "Rega moderada, esperando a camada superficial do solo secar.",
    soil: "Substrato leve, aerado e bem drenado.",
    diseases: ["podridão de raiz", "manchas bacterianas", "cochonilhas", "ácaros"],
    attention: "Muitas espécies desta família podem ser tóxicas se ingeridas por pessoas ou animais.",
  },
  "arecaceas": {
    habit: "Palmeiras de porte variado, comuns em paisagismo tropical e vasos grandes.",
    light: "Sol pleno a meia-sombra, conforme a espécie.",
    watering: "Rega regular, com redução em períodos frios.",
    soil: "Solo profundo, drenável e com boa fertilidade.",
    diseases: ["fungos foliares", "podridão do colo", "cochonilhas", "ácaros"],
    attention: "Pontas secas podem indicar ar muito seco, salinidade ou irrigação irregular.",
  },
  "asfodelaceas": {
    habit: "Suculentas e plantas de folhas carnosas, como babosas e aloes.",
    light: "Sol direto suave ou muita claridade.",
    watering: "Rega espaçada; deixe o substrato secar bem entre regas.",
    soil: "Substrato muito drenável, semelhante ao usado para suculentas.",
    diseases: ["podridão de raiz", "fungos por excesso de umidade", "cochonilhas"],
    attention: "O maior risco costuma ser excesso de água.",
  },
  "asparagaceas": {
    habit: "Grupo amplo, com ornamentais resistentes, agaves, dracenas e espadas.",
    light: "Sol pleno, meia-sombra ou luz indireta, conforme a espécie.",
    watering: "Rega moderada a baixa; muitas espécies toleram seca curta.",
    soil: "Solo bem drenado, evitando acúmulo de água.",
    diseases: ["podridão de raiz", "manchas foliares", "cochonilhas", "tripes"],
    attention: "Folhas moles ou escurecidas geralmente indicam excesso de umidade.",
  },
  "asteraceas": {
    habit: "Família de margaridas, girassóis e muitas herbáceas floríferas.",
    light: "Sol pleno para boa floração.",
    watering: "Rega regular, evitando molhar flores e folhas em excesso.",
    soil: "Solo fértil, drenável e com boa matéria orgânica.",
    diseases: ["oídio", "ferrugem", "manchas foliares", "pulgões", "lagartas"],
    attention: "Boa ventilação ajuda a reduzir fungos em folhas e flores.",
  },
  "bromeliaceas": {
    habit: "Bromélias ornamentais, muitas com roseta e reservatório central de água.",
    light: "Luz filtrada ou meia-sombra clara.",
    watering: "Manter umidade moderada; renovar água acumulada na roseta quando existir.",
    soil: "Substrato leve, fibroso e muito drenável.",
    diseases: ["podridão da roseta", "fungos por excesso de água", "cochonilhas"],
    attention: "Evite água parada por muito tempo para reduzir apodrecimento e mosquitos.",
  },
  "fabaceas": {
    habit: "Árvores, arbustos, trepadeiras e herbáceas, muitas com flores vistosas ou vagens.",
    light: "Sol pleno na maioria das espécies.",
    watering: "Rega regular no estabelecimento; depois varia conforme o porte.",
    soil: "Solo drenável, com fertilidade moderada.",
    diseases: ["ferrugem", "antracnose", "manchas foliares", "pulgões", "brocas"],
    attention: "Inspecione brotos novos, onde pulgões e cochonilhas costumam aparecer primeiro.",
  },
  "lamiaceas": {
    habit: "Ervas aromáticas e ornamentais como hortelã, manjericão, alecrim, sálvia e lavanda.",
    light: "Sol pleno ou muita claridade.",
    watering: "Rega moderada, sem manter o solo encharcado.",
    soil: "Solo leve e drenável; algumas espécies preferem substrato menos compactado.",
    diseases: ["oídio", "míldio", "podridão de raiz", "pulgões", "mosca-branca"],
    attention: "Excesso de umidade e pouca ventilação favorecem fungos.",
  },
  "rosaceas": {
    habit: "Família de roseiras, frutíferas temperadas e arbustos ornamentais.",
    light: "Sol pleno, com boa circulação de ar.",
    watering: "Rega profunda e regular, preferindo molhar o solo e não as folhas.",
    soil: "Solo fértil, drenável e rico em matéria orgânica.",
    diseases: ["mancha-negra", "oídio", "ferrugem", "pulgões", "ácaros"],
    attention: "Folhas com manchas escuras ou pó branco pedem poda sanitária e melhor ventilação.",
  },
};

const DEFAULT_DETAIL_PROFILE = {
  habit: "Planta ornamental ou botânica com características que variam conforme a espécie.",
  light: "Prefira boa luminosidade e ajuste entre sol, meia-sombra ou luz indireta conforme resposta da planta.",
  watering: "Regue quando o solo começar a secar, evitando encharcamento.",
  soil: "Use solo ou substrato com boa drenagem.",
  diseases: ["manchas foliares", "fungos por excesso de umidade", "cochonilhas", "pulgões", "ácaros"],
  attention: "As informações são orientativas por família; confirme exigências específicas para espécies sensíveis.",
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setLoading(isLoading) {
  plantsLoading.hidden = !isLoading;
}

function showError(message) {
  plantsError.textContent = message;
  plantsError.hidden = false;
}

function hideError() {
  plantsError.textContent = "";
  plantsError.hidden = true;
}

function getPlantName(plant) {
  return plant.namePtBr || plant.name || "Planta sem nome";
}

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    const trimmedImage = image.trim();

    if (!trimmedImage || trimmedImage === "null" || trimmedImage === "undefined") {
      return "";
    }

    if (trimmedImage.startsWith("{")) {
      try {
        return getImageUrl(JSON.parse(trimmedImage));
      } catch (error) {
        return trimmedImage;
      }
    }

    return trimmedImage;
  }

  if (typeof image === "object") {
    return (
      image.original_url ||
      image.regular_url ||
      image.medium_url ||
      image.small_url ||
      image.thumbnail ||
      image.url ||
      ""
    );
  }

  return "";
}

function getImageCandidates(imageUrl) {
  if (!imageUrl) {
    return [];
  }

  const candidates = [imageUrl];
  const [baseUrl] = imageUrl.split("?");

  if (baseUrl && baseUrl !== imageUrl) {
    candidates.push(baseUrl);
  }

  return [...new Set(candidates)];
}

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getFamilyProfile(plant) {
  const familyKey = normalizeKey(plant.family || currentFamily).replaceAll(" ", "");

  return FAMILY_DETAIL_PROFILES[familyKey] || DEFAULT_DETAIL_PROFILE;
}

function renderDetailCard(title, text) {
  return `
    <article class="detail-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
    </article>
  `;
}

function renderDiseaseTags(diseases) {
  return diseases
    .map((disease) => `<span class="disease-tag">${escapeHtml(disease)}</span>`)
    .join("");
}

function renderPlantDetails(plant) {
  if (!plantDetails) {
    return;
  }

  const profile = getFamilyProfile(plant);

  plantDetails.hidden = false;
  plantDetails.innerHTML = `
    <div class="details-grid">
      ${renderDetailCard("Tipo e uso", profile.habit)}
      ${renderDetailCard("Luz indicada", profile.light)}
      ${renderDetailCard("Rega", profile.watering)}
      ${renderDetailCard("Solo", profile.soil)}
    </div>

    <section class="disease-panel">
      <div>
        <h2 class="description-title">Doenças e pragas comuns</h2>
        <p class="detail-note">
          Possíveis problemas observados em plantas desta família ou com cultivo semelhante.
        </p>
      </div>

      <div class="disease-tags">
        ${renderDiseaseTags(profile.diseases)}
      </div>
    </section>

    <section class="attention-panel">
      <h2 class="description-title">Atenção no cultivo</h2>
      <p class="description-text" id="plantAttentionText">${escapeHtml(profile.attention)}</p>
      <p class="attention-source" id="plantAttentionSource">Informação inicial por família botânica.</p>
    </section>
  `;
}

function setPlantAttentionStatus(message) {
  const attentionSource = document.getElementById("plantAttentionSource");

  if (attentionSource) {
    attentionSource.textContent = message;
  }
}

async function updatePlantCareAttention(plant) {
  if (!plant || !plant.id || typeof getPlantCareAttention !== "function") {
    return;
  }

  const selectedId = Number(plant.id);
  const attentionText = document.getElementById("plantAttentionText");

  setPlantAttentionStatus("Buscando atenção específica desta planta...");

  try {
    const result = await getPlantCareAttention(selectedId);

    if (currentSelectedPlantId !== selectedId || !attentionText) {
      return;
    }

    attentionText.textContent = result.attention || attentionText.textContent;
    setPlantAttentionStatus(
      result.source === "perenual"
        ? "Informação específica pesquisada pela espécie."
        : "Informação específica indisponível; usando fallback local."
    );
  } catch (error) {
    console.error(error);

    if (currentSelectedPlantId === selectedId) {
      setPlantAttentionStatus("Não foi possível pesquisar agora; usando informação inicial.");
    }
  }
}

function renderPlantImage(plant) {
  const name = getPlantName(plant);
  const imageUrl = getImageUrl(plant.default_image);
  const imageCandidates = getImageCandidates(imageUrl);

  if (!imageCandidates.length) {
    plantImageBox.innerHTML = `<div class="plant-image-placeholder">Sem imagem</div>`;
    return;
  }

  plantImageBox.innerHTML = "";

  const image = document.createElement("img");
  let imageIndex = 0;

  image.alt = name;

  image.addEventListener("error", () => {
    imageIndex++;

    if (imageIndex < imageCandidates.length) {
      image.src = imageCandidates[imageIndex];
      return;
    }

    plantImageBox.innerHTML = `<div class="plant-image-placeholder">Imagem indisponível</div>`;
  });

  image.src = imageCandidates[imageIndex];
  plantImageBox.appendChild(image);
}

function selectPlant(index) {
  const plant = currentPlants[index];

  if (!plant) {
    return;
  }

  plantsList.querySelectorAll(".plant-item").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
  });

  const name = getPlantName(plant);
  currentSelectedPlantId = Number(plant.id || 0);
  plantTitle.textContent = name;
  scientificName.textContent = plant.scientificName || "Nome científico indisponível";
  plantFamily.textContent = plant.family || currentFamily;
  plantDescription.textContent = plant.description || "Descrição indisponível para esta planta.";
  renderPlantDetails(plant);
  updatePlantCareAttention(plant);
  renderPlantImage(plant);
}

function renderPlantsList(plants) {
  plantsList.innerHTML = plants
    .map((plant, index) => {
      const name = getPlantName(plant);

      return `
        <li>
          <button class="plant-item ${index === 0 ? "active" : ""}" type="button" data-index="${index}">
            <span class="plant-icon">
              <img src="img/folha-planta.png" alt="">
            </span>
            <span class="plant-name">${escapeHtml(name)}</span>
          </button>
        </li>
      `;
    })
    .join("");

  plantsList.querySelectorAll(".plant-item").forEach((button) => {
    button.addEventListener("click", () => {
      selectPlant(Number(button.dataset.index));
    });
  });
}

async function loadFamilyPlants() {
  hideError();
  setLoading(true);

  try {
    const result = await getPlantsByFamily(currentFamily, 1, perPage);
    currentPlants = Array.isArray(result.data) ? result.data : [];
    const totalPlants = Number(result.total || currentPlants.length);
    const resolvedFamily = result.family || currentFamily;

    familyTitle.textContent = resolvedFamily;
    plantsCount.textContent =
      totalPlants === 1 ? "1 planta encontrada" : `${totalPlants} plantas encontradas`;

    if (!currentPlants.length) {
      plantsList.innerHTML = "";
      plantTitle.textContent = `Plantas da família ${resolvedFamily}`;
      scientificName.textContent = "";
      plantFamily.textContent = "";
      plantDescription.textContent = "Nenhuma planta encontrada para esta família.";
      if (plantDetails) {
        plantDetails.hidden = true;
        plantDetails.innerHTML = "";
      }
      plantImageBox.innerHTML = `<div class="plant-image-placeholder">Sem imagem</div>`;
      return;
    }

    renderPlantsList(currentPlants);
    selectPlant(0);
  } catch (error) {
    console.error(error);
    plantsList.innerHTML = "";
    plantsCount.textContent = "";
    showError("Não foi possível carregar as plantas desta família.");
  } finally {
    setLoading(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  currentFamily = (params.get("family") || "").trim();

  if (!currentFamily) {
    setLoading(false);
    familyTitle.textContent = "Familia nao informada";
    plantTitle.textContent = "Familia nao informada";
    plantDescription.textContent = "Volte para categorias e escolha uma família de plantas.";
    if (plantDetails) {
      plantDetails.hidden = true;
    }
    return;
  }

  familyTitle.textContent = currentFamily;
  plantTitle.textContent = `Plantas da família ${currentFamily}`;
  loadFamilyPlants();
});
