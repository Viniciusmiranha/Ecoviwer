let familiasCarregadas = [];
let familiasFiltradas = [];
let gruposFamilias = [];
let grupoAtual = 0;

const cardsWrapper = document.getElementById("cardsWrapper");
const pagination = document.getElementById("pagination");
const arrowRight = document.querySelector(".arrow-right");
const arrowLeft = document.querySelector(".arrow-left");
const familySearch = document.getElementById("familySearch");
const searchSuggestions = document.getElementById("searchSuggestions");

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dividirEmGrupos(lista, tamanho) {
  const grupos = [];

  for (let i = 0; i < lista.length; i += tamanho) {
    grupos.push(lista.slice(i, i + tamanho));
  }

  return grupos;
}

function normalizarBusca(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function montarTextoBusca(familia) {
  return normalizarBusca([
    familia.family,
    familia.familyPopular,
    familia.totalPlants,
  ].join(" "));
}

function obterNomesPopulares(familia) {
  return String(familia.familyPopular || "")
    .split(",")
    .map((nome) => nome.trim())
    .filter(Boolean);
}

function obterNomePopularPrincipal(familia) {
  return obterNomesPopulares(familia)[0] || "";
}

function obterDetalheDaSugestao(familia, termo) {
  const termoNormalizado = normalizarBusca(termo);
  const partesBusca = termoNormalizado.split(" ").filter(Boolean);
  const nomesPopulares = obterNomesPopulares(familia);
  const nomePopularEncontrado = nomesPopulares.find((nome) => {
    const nomeNormalizado = normalizarBusca(nome);

    return partesBusca.every((parte) => nomeNormalizado.includes(parte));
  });
  const nomePopularPrincipal = obterNomePopularPrincipal(familia);

  if (nomePopularEncontrado) {
    return {
      titulo: nomePopularEncontrado,
      detalhe: `Nome popular da familia ${familia.family}`,
    };
  }

  return {
    titulo: familia.family || "Familia sem nome",
    detalhe: nomePopularPrincipal
      ? `Tambem conhecida por ${nomePopularPrincipal}`
      : "Familia botanica",
  };
}

function filtrarFamilias(termo) {
  const termoNormalizado = normalizarBusca(termo);

  if (!termoNormalizado) {
    return familiasCarregadas;
  }

  const partesBusca = termoNormalizado.split(" ").filter(Boolean);

  return familiasCarregadas.filter((familia) => {
    const textoBusca = montarTextoBusca(familia);

    return partesBusca.every((parte) => textoBusca.includes(parte));
  });
}

function ocultarSugestoes() {
  if (!searchSuggestions) {
    return;
  }

  searchSuggestions.innerHTML = "";
  searchSuggestions.classList.remove("is-visible");
}

function renderizarSugestoes(termo, familias) {
  if (!searchSuggestions) {
    return;
  }

  const termoNormalizado = normalizarBusca(termo);

  if (!termoNormalizado || !familias.length) {
    ocultarSugestoes();
    return;
  }

  searchSuggestions.innerHTML = familias
    .slice(0, 6)
    .map((familia) => {
      const sugestao = obterDetalheDaSugestao(familia, termo);
      const familyName = familia.family || "";

      return `
        <button class="search-suggestion" type="button" data-family="${escapeHtml(familyName)}">
          <span class="suggestion-title">${escapeHtml(sugestao.titulo)}</span>
          <span class="suggestion-detail">${escapeHtml(sugestao.detalhe)}</span>
        </button>
      `;
    })
    .join("");

  searchSuggestions.classList.add("is-visible");
}

function atualizarResultadoBusca() {
  const termo = familySearch ? familySearch.value : "";

  familiasFiltradas = filtrarFamilias(termo);
  gruposFamilias = dividirEmGrupos(familiasFiltradas, 3);
  grupoAtual = 0;
  renderizarSugestoes(termo, familiasFiltradas);

  if (!familiasFiltradas.length) {
    renderizarMensagem("Nenhuma familia encontrada para esta pesquisa.");
    return;
  }

  renderizarCards();
}

function renderizarPlaceholder() {
  return `
    <div class="card-image-placeholder">
      Sem imagem
    </div>
  `;
}

function aplicarFallbackDeImagem(container, placeholderClass) {
  container.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      const placeholder = document.createElement("div");
      placeholder.className = placeholderClass;
      placeholder.textContent = "Sem imagem";
      image.replaceWith(placeholder);
    });
  });
}

function renderizarMensagem(mensagem) {
  cardsWrapper.innerHTML = `
    <div class="carousel-message">
      ${escapeHtml(mensagem)}
    </div>
  `;
  pagination.innerHTML = "";
}

function renderizarCards() {
  const grupo = gruposFamilias[grupoAtual] || [];

  cardsWrapper.innerHTML = grupo
    .map((familia) => {
      const familyName = familia.family || "Familia sem nome";
      const familyUrl = "plantas.html?family=" + encodeURIComponent(familyName);
      const totalPlants = Number(familia.totalPlants || 0);
      const totalText = totalPlants === 1 ? "1 planta encontrada" : `${totalPlants} plantas encontradas`;

      return `
        <a href="${familyUrl}" class="card">
          <div class="card-image">
            ${
              familia.default_image
                ? `<img src="${familia.default_image}" alt="${escapeHtml(familyName)}">`
                : renderizarPlaceholder()
            }
          </div>

          <div class="card-body">
            <div class="icon-circle">
              <img class="icon-leaf" src="img/folha-planta.png" alt="">
            </div>

            <h2>${escapeHtml(familyName)}</h2>

            <p>
              ${escapeHtml(totalText)}
            </p>

            <span class="card-button">
              Ver plantas &rarr;
            </span>
          </div>
        </a>
      `;
    })
    .join("");

  atualizarBolinhas();
  aplicarFallbackDeImagem(cardsWrapper, "card-image-placeholder");
}

function atualizarBolinhas() {
  pagination.innerHTML = gruposFamilias
    .map((_, index) => `
      <span class="dot ${index === grupoAtual ? "active" : ""}"></span>
    `)
    .join("");
}

async function carregarFamilias() {
  renderizarMensagem("Carregando familias...");

  try {
    const familias = await getAllFamilies();

    if (!familias.length) {
      renderizarMensagem("Nenhuma familia encontrada.");
      return;
    }

    familiasCarregadas = familias;
    familiasFiltradas = familias;
    gruposFamilias = dividirEmGrupos(familiasFiltradas, 3);
    grupoAtual = 0;
    renderizarCards();
  } catch (error) {
    console.error(error);
    renderizarMensagem("Nao foi possivel carregar as familias. Verifique se o back-end esta rodando.");
  }
}

arrowRight.addEventListener("click", () => {
  if (!gruposFamilias.length) {
    return;
  }

  grupoAtual++;

  if (grupoAtual >= gruposFamilias.length) {
    grupoAtual = 0;
  }

  renderizarCards();
});

arrowLeft.addEventListener("click", () => {
  if (!gruposFamilias.length) {
    return;
  }

  grupoAtual--;

  if (grupoAtual < 0) {
    grupoAtual = gruposFamilias.length - 1;
  }

  renderizarCards();
});

if (familySearch) {
  familySearch.addEventListener("input", atualizarResultadoBusca);
  familySearch.addEventListener("focus", atualizarResultadoBusca);
}

if (searchSuggestions) {
  searchSuggestions.addEventListener("click", (event) => {
    const suggestion = event.target.closest(".search-suggestion");

    if (!suggestion || !familySearch) {
      return;
    }

    familySearch.value = suggestion.dataset.family || "";
    atualizarResultadoBusca();
    ocultarSugestoes();
  });
}

document.addEventListener("DOMContentLoaded", carregarFamilias);
