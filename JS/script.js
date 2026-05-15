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

  // ===== RELÃ“GIO =====
  function atualizarRelogio() {
    const agora = new Date();
    let horas = agora.getHours().toString().padStart(2, '0');
    let minutos = agora.getMinutes().toString().padStart(2, '0');

    document.getElementById('time').textContent = `${horas}:${minutos}`;
  }

  // ===== ESTACAO =====
  function atualizarEstacao() {
    const hoje = new Date();
    const mes = hoje.getMonth() + 1;
    const dia = hoje.getDate();

    let estacao = "";

    if (mes === 12 || mes < 3 || (mes === 3 && dia < 20)) {
      estacao = "Verão";
    } else if (mes < 6 || (mes === 6 && dia < 21)) {
      estacao = "Outono";
    } else if (mes < 9 || (mes === 9 && dia < 22)) {
      estacao = "Inverno";
    } else {
      estacao = "Primavera";
    }

    document.getElementById("season").textContent = estacao;
  }

  // ===== DATA ( FALTAVA ISSO) =====
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

// ===== ACESSIBILIDADE (VERSÃO PROFISSIONAL) =====

let escala = localStorage.getItem("escala") 
  ? parseFloat(localStorage.getItem("escala")) 
  : 1;

const MIN = 0.8;
const MAX = 1.5;

// aplica escala ao carregar
document.documentElement.style.setProperty('--escala', escala);

// ===== FONTE =====
function aumentarFonte() {
  if (escala < MAX) {
    escala = Math.round((escala + 0.1) * 10) / 10;
    aplicarEscala();
  }
}

function diminuirFonte() {
  if (escala > MIN) {
    escala = Math.round((escala - 0.1) * 10) / 10;
    aplicarEscala();
  }
}

function resetarFonte() {
  escala = 1;
  aplicarEscala();
}

function aplicarEscala() {
  document.documentElement.style.setProperty('--escala', escala);
  localStorage.setItem("escala", escala);
}

// ===== TECLADO =====
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "+") aumentarFonte();
  if (e.ctrlKey && e.key === "-") diminuirFonte();
  if (e.ctrlKey && e.key === "0") resetarFonte();
});

// FEEDBACK

function abrirFeedback() {
  const modal = document.getElementById("feedbackModal");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".menu-overlay");

  nav?.classList.remove("active");
  toggle?.classList.remove("active");
  overlay?.classList.remove("active");
  document.body.classList.remove("menu-open");

  modal.classList.add("active");
  limparFeedbackStatus();
  document.getElementById("feedbackNome")?.focus();
}

function fecharFeedback() {
  document.getElementById("feedbackModal").classList.remove("active");
}

function limparFeedbackStatus() {
  const status = document.getElementById("feedbackStatus");

  if (!status) return;

  status.textContent = "";
  status.className = "feedback-status";
}

function definirFeedbackStatus(mensagem, tipo = "info") {
  const status = document.getElementById("feedbackStatus");

  if (!status) return;

  status.textContent = mensagem;
  status.className = `feedback-status ${tipo}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");
  const submitButton = document.getElementById("feedbackSubmit");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    limparFeedbackStatus();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const payload = {
      nome: String(formData.get("nome") || "").trim(),
      descricao: String(formData.get("descricao") || "").trim(),
    };

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    try {
      await createFeedback(payload);
      form.reset();
      definirFeedbackStatus("Feedback enviado com sucesso.", "success");
    } catch (error) {
      const details = Array.isArray(error.details) && error.details.length
        ? ` ${error.details.join(" ")}`
        : "";

      definirFeedbackStatus(`${error.message || "Nao foi possivel enviar o feedback."}${details}`, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar feedback";
    }
  });
});

// menu hamburguer
function toggleMenu() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  const overlay = document.querySelector(".menu-overlay");

  nav.classList.toggle("active");
  toggle.classList.toggle("active");
  overlay.classList.toggle("active");

  document.body.classList.toggle("menu-open");
}

