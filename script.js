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