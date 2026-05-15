let currentPage = 1;
let currentFamily = "";
let totalPages = 1;

const perPage = 1000;

const familyTitle = document.getElementById("family-title");
const familySummary = document.getElementById("family-summary");
const familyLoading = document.getElementById("family-loading");
const familyError = document.getElementById("family-error");
const plantsGrid = document.getElementById("plants-grid");
const previousPageButton = document.getElementById("previous-page");
const nextPageButton = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const pagination = document.getElementById("family-pagination");

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setLoading(isLoading) {
  familyLoading.hidden = !isLoading;
  previousPageButton.disabled = isLoading || currentPage <= 1;
  nextPageButton.disabled = isLoading || currentPage >= totalPages;
}

function showError(message) {
  familyError.textContent = message;
  familyError.hidden = false;
}

function hideError() {
  familyError.textContent = "";
  familyError.hidden = true;
}

function renderPlantImage(plant) {
  if (plant.default_image) {
    return `<img src="${plant.default_image}" alt="${escapeHtml(plant.namePtBr || plant.name || "Planta")}">`;
  }

  return `
    <div class="plant-image-placeholder">
      Sem imagem
    </div>
  `;
}

function aplicarFallbackDeImagem() {
  plantsGrid.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      const placeholder = document.createElement("div");
      placeholder.className = "plant-image-placeholder";
      placeholder.textContent = "Sem imagem";
      image.replaceWith(placeholder);
    });
  });
}

function renderPlants(plants) {
  plantsGrid.innerHTML = plants
    .map((plant) => {
      const name = plant.namePtBr || plant.name || "Planta sem nome";
      const scientificName = plant.scientificName || "Nome cientifico indisponivel";
      const family = plant.family || currentFamily;

      return `
        <article class="plant-card">
          <div class="plant-image">
            ${renderPlantImage(plant)}
          </div>

          <div class="plant-card-body">
            <h2>${escapeHtml(name)}</h2>
            <p><strong>Nome cientifico:</strong> ${escapeHtml(scientificName)}</p>
            <p><strong>Familia:</strong> ${escapeHtml(family)}</p>
          </div>
        </article>
      `;
    })
    .join("");

  aplicarFallbackDeImagem();
}

function updatePagination(result) {
  currentPage = result.page || 1;
  totalPages = result.totalPages || 1;

  pageInfo.textContent = `Pagina ${currentPage} de ${totalPages}`;
  previousPageButton.disabled = currentPage <= 1;
  nextPageButton.disabled = currentPage >= totalPages;
}

async function loadFamilyPlants(page = 1) {
  hideError();
  setLoading(true);

  try {
    const result = await getPlantsByFamily(currentFamily, page, perPage);
    const plants = Array.isArray(result.data) ? result.data : [];

    familyTitle.textContent = `Plantas da familia ${result.family || currentFamily}`;
    familySummary.textContent = result.total
      ? `${result.total} plantas encontradas`
      : "";

    if (!plants.length && Number(result.total || 0) === 0) {
      plantsGrid.innerHTML = `
        <p class="family-status">
          Nenhuma planta encontrada para esta familia.
        </p>
      `;
    } else {
      renderPlants(plants);
    }

    updatePagination(result);
  } catch (error) {
    console.error(error);
    plantsGrid.innerHTML = "";
    showError("Nao foi possivel carregar as plantas desta familia.");
  } finally {
    setLoading(false);
  }
}

previousPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    loadFamilyPlants(currentPage - 1);
  }
});

nextPageButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    loadFamilyPlants(currentPage + 1);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const familyFromUrl = params.get("family");
  currentFamily = decodeURIComponent(familyFromUrl || "").trim();

  if (!currentFamily) {
    familyTitle.textContent = "Familia nao informada.";
    familySummary.textContent = "";
    familyLoading.hidden = true;
    plantsGrid.innerHTML = "";
    pagination.hidden = true;
    return;
  }

  familyTitle.textContent = `Plantas da familia ${currentFamily}`;
  loadFamilyPlants(1);
});
