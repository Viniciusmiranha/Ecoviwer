const API_BASE_URL = "http://localhost:3000/api";

async function getFamilies(page = 1, perPage = 20) {
  const response = await fetch(`${API_BASE_URL}/families?page=${page}&perPage=${perPage}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar famílias de plantas");
  }

  return response.json();
}

async function getAllFamilies(perPage = 100) {
  const firstPage = await getFamilies(1, perPage);
  const allFamilies = Array.isArray(firstPage.data) ? [...firstPage.data] : [];
  const totalFamilies = Number(firstPage.total || allFamilies.length);
  const totalPages = Number(firstPage.totalPages || Math.ceil(totalFamilies / perPage) || 1);

  for (let page = 2; page <= totalPages; page++) {
    const response = await getFamilies(page, perPage);
    const families = Array.isArray(response.data) ? response.data : [];
    allFamilies.push(...families);
  }

  return allFamilies;
}

async function getPlantsByFamily(family, page = 1, perPage = 29) {
  const encodedFamily = encodeURIComponent(family);

  const response = await fetch(
    `${API_BASE_URL}/families/${encodedFamily}/plants/${page}?perPage=${perPage}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar plantas da família");
  }

  return response.json();
}

async function getPlantCareAttention(plantId) {
  const response = await fetch(`${API_BASE_URL}/plants/${encodeURIComponent(plantId)}/care-attention`);

  if (!response.ok) {
    throw new Error("Erro ao buscar atenção de cultivo da planta");
  }

  return response.json();
}

async function createFeedback(payload) {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || "Não foi possível enviar o feedback");
    error.details = Array.isArray(data?.errors) ? data.errors : [];
    throw error;
  }

  return data;
}

async function getFeedbacks() {
  const response = await fetch(`${API_BASE_URL}/feedback`);

  if (!response.ok) {
    throw new Error("Erro ao buscar feedbacks");
  }

  return response.json();
}
