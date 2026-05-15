const ADMIN_NAMES = new Set([
  "rafael",
  "yan",
  "jonathan",
  "vinicius",
  "caio",
  "bruno",
  "gabriel",
  "marcio",
]);

const ADMIN_PASSWORD = "ecoviewerPassAdmin";
const ADMIN_SESSION_KEY = "ecoviwerAdminFeedbackAccess";

function normalizeAdminName(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isAdminAllowed(name, password) {
  return ADMIN_NAMES.has(normalizeAdminName(name)) && password === ADMIN_PASSWORD;
}

function formatFeedbackDate(value) {
  if (!value) return "Data nao informada";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Data nao informada";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function setLoginMessage(message) {
  document.getElementById("adminLoginMessage").textContent = message;
}

function showPanel() {
  document.getElementById("adminLogin").hidden = true;
  document.getElementById("feedbackPanel").hidden = false;
  loadFeedbacks();
}

function showLogin() {
  document.getElementById("feedbackPanel").hidden = true;
  document.getElementById("adminLogin").hidden = false;
  document.getElementById("adminPassword").value = "";
  document.getElementById("adminName").focus();
}

function renderFeedbacks(feedbacks) {
  const list = document.getElementById("feedbackList");
  const count = document.getElementById("feedbackCount");

  list.innerHTML = "";

  if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
    count.textContent = "Nenhum feedback recebido.";
    list.innerHTML = '<div class="empty-state">Ainda nao ha feedbacks cadastrados.</div>';
    return;
  }

  count.textContent = `${feedbacks.length} feedback${feedbacks.length === 1 ? "" : "s"} recebido${feedbacks.length === 1 ? "" : "s"}.`;

  feedbacks.forEach((feedback) => {
    const item = document.createElement("article");
    item.className = "feedback-card";

    const name = document.createElement("h2");
    name.textContent = feedback.nome || "Sem nome";

    const date = document.createElement("time");
    date.dateTime = feedback.createdAt || "";
    date.textContent = formatFeedbackDate(feedback.createdAt);

    const description = document.createElement("p");
    description.textContent = feedback.descricao || feedback.comentario || "Sem mensagem";

    item.append(name, date, description);
    list.appendChild(item);
  });
}

async function loadFeedbacks() {
  const message = document.getElementById("feedbackListMessage");
  const refreshButton = document.getElementById("refreshFeedbacks");

  message.textContent = "";
  refreshButton.disabled = true;
  refreshButton.textContent = "Atualizando...";

  try {
    const feedbacks = await getFeedbacks();
    renderFeedbacks(feedbacks);
  } catch (error) {
    document.getElementById("feedbackCount").textContent = "Nao foi possivel carregar os feedbacks.";
    message.textContent = error.message || "Erro ao buscar feedbacks.";
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "Atualizar";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  const logoutButton = document.getElementById("adminLogout");
  const refreshButton = document.getElementById("refreshFeedbacks");

  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "true") {
    showPanel();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("adminName");
    const password = String(formData.get("adminPassword") || "");

    if (!isAdminAllowed(name, password)) {
      setLoginMessage("Acesso negado.");
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    setLoginMessage("");
    showPanel();
  });

  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    showLogin();
  });

  refreshButton.addEventListener("click", loadFeedbacks);
});
