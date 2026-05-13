const plantButtons = document.querySelectorAll(".plant-item");

const plantTitle = document.getElementById("plantTitle");
const scientificName = document.getElementById("scientificName");
const plantDescription = document.getElementById("plantDescription");
const plantImage = document.getElementById("plantImage");

plantButtons.forEach(button => {

  button.addEventListener("click", () => {

    /* REMOVE ACTIVE */
    plantButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    /* ADICIONA ACTIVE */
    button.classList.add("active");

    /* TROCA DADOS */
    plantTitle.textContent = button.dataset.name;

    scientificName.textContent = button.dataset.scientific;

    plantDescription.textContent = button.dataset.description;

    plantImage.src = button.dataset.image;

  });

});
