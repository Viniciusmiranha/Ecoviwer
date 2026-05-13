const categorias = [

  // GRUPO 1
  [
    {
      titulo: "Venenosas",
      texto: "Plantas que podem causar reações adversas e devem ser manuseadas com cuidado.",
      imagem: "img/venenosas.jpg",
      icone: "☠"
    },

    {
      titulo: "Digestivas",
      texto: "Plantas que auxiliam na digestão e promovem o bem-estar do organismo.",
      imagem: "img/digestivas.jpg",
      icone: "☘"
    },

    {
      titulo: "Frutíferas",
      texto: "Plantas que produzem frutos comestíveis e nutritivos para uma alimentação saudável.",
      imagem: "img/frutiferas.jpg",
      icone: "🍏"
    }
  ],

  // GRUPO 2
  [
    {
      titulo: "Medicinais",
      texto: "Plantas utilizadas para tratamentos naturais e cuidados com a saúde.",
      imagem: "img/medicinais.jpg",
      icone: "🌿"
    },

    {
      titulo: "Ornamentais",
      texto: "Plantas usadas para decoração e valorização de ambientes.",
      imagem: "img/ornamentais.jpg",
      icone: "🌸"
    },

    {
      titulo: "Tropicais",
      texto: "Espécies adaptadas a climas quentes e úmidos.",
      imagem: "img/tropicais.jpg",
      icone: "🌴",
      classeIcone: "tropical-icon"
    }
  ],

  // GRUPO 3
  [
    {
      titulo: "Aquáticas",
      texto: "Plantas que vivem em ambientes aquáticos e úmidos.",
      imagem: "img/aquaticas.jpg",
      icone: "💧"
    },

    {
      titulo: "Carnívoras",
      texto: "Espécies que capturam pequenos insetos para nutrição.",
      imagem: "img/carnivoras.jpg",
      icone: "🪰"
    },

    {
      titulo: "Suculentas",
      texto: "Plantas resistentes com armazenamento interno de água.",
      imagem: "img/suculentas.jpg",
      icone: "🌵"
    }
  ]

];

let grupoAtual = 0;

const cardsWrapper = document.getElementById("cardsWrapper");
const pagination = document.getElementById("pagination");

function renderizarCards() {

  cardsWrapper.innerHTML = "";

  categorias[grupoAtual].forEach(card => {

    cardsWrapper.innerHTML += `

      <a href="../saiba-mais.html" class="card">

        <div class="card-image">
          <img src="${card.imagem}" alt="${card.titulo}">
        </div>

        <div class="card-body">

          <div class="icon-circle ${card.classeIcone || ''}">
            ${card.icone}
          </div>

          <h2>${card.titulo}</h2>

          <p>
            ${card.texto}
          </p>

          <span class="card-button">
            Ver plantas →
          </span>

        </div>

      </a>

    `;
  });

  atualizarBolinhas();
}

function atualizarBolinhas() {

  pagination.innerHTML = "";

  categorias.forEach((_, index) => {

    pagination.innerHTML += `
      <span class="dot ${index === grupoAtual ? 'active' : ''}"></span>
    `;
  });
}

document.querySelector(".arrow-right")
.addEventListener("click", () => {

  grupoAtual++;

  if(grupoAtual >= categorias.length){
    grupoAtual = 0;
  }

  renderizarCards();
});

document.querySelector(".arrow-left")
.addEventListener("click", () => {

  grupoAtual--;

  if(grupoAtual < 0){
    grupoAtual = categorias.length - 1;
  }

  renderizarCards();
});

renderizarCards();
