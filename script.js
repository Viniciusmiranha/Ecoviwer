document.addEventListener("DOMContentLoaded", () => {

  // ===== HEADER QUE ESCONDE =====
  let lastScroll = 0;
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll) {
      header.classList.add("hide"); // descendo
    } else {
      header.classList.remove("hide"); // subindo
    }

    lastScroll = currentScroll;
  });

  // ===== RELÓGIO =====
  function atualizarRelogio() {
    const agora = new Date();
    let horas = agora.getHours().toString().padStart(2, '0');
    let minutos = agora.getMinutes().toString().padStart(2, '0');

    document.getElementById('time').textContent = `${horas}:${minutos}`;
  }

  // ===== ESTAÇÃO =====
  function atualizarEstacao() {
    const hoje = new Date();
    const mes = hoje.getMonth() + 1;

    let estacao = "";

    if (mes >= 12 || mes <= 2) {
      estacao = "Verão";
    } else if (mes >= 3 && mes <= 5) {
      estacao = "Outono";
    } else if (mes >= 6 && mes <= 8) {
      estacao = "Inverno";
    } else {
      estacao = "Primavera";
    }

    document.getElementById("season").textContent = estacao;
  }

  // ===== DATA (🔥 FALTAVA ISSO) =====
  function atualizarData() {
    const hoje = new Date();

    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear();

    document.getElementById("date").textContent = `${dia}/${mes}`;
  }

  // ===== INICIAR =====
  setInterval(atualizarRelogio, 1000);

  atualizarRelogio();
  atualizarEstacao();
  atualizarData();

});

 // ===== MODAL LOGIN =====

function abrirLogin() {
  document.getElementById("loginModal").classList.add("active");
}

function fecharLogin() {
  document.getElementById("loginModal").classList.remove("active");
}
// ABRIR/FECHAR PAINEL
function toggleAcessibilidade() {
  const panel = document.getElementById("acessibilidadePanel");

  if (panel.style.display === "flex") {
    panel.style.display = "none";
  } else {
    panel.style.display = "flex";
  }
}

// AUMENTAR FONTE
let escala = 1;

function aumentarFonte() {
  escala += 0.1;
  document.documentElement.style.setProperty('--escala', escala);
}

function diminuirFonte() {
  if (escala > 0.7) {
    escala -= 0.1;
    document.documentElement.style.setProperty('--escala', escala);
  }
}

// CONTRASTE
function toggleContraste() {
  document.body.classList.toggle("contraste");
}

// FEEDBACK

function abrirFeedback() {
  document.getElementById("feedbackModal").classList.add("active");
}

function fecharFeedback() {
  document.getElementById("feedbackModal").classList.remove("active");
}

// menu hamburguer
function toggleMenu() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".menu-overlay");

  nav.classList.toggle("active");
  toggle.classList.toggle("active");
  overlay.classList.toggle("active");
}
