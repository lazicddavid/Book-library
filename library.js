// Selektori
const btnNewBook = document.getElementById("btnNewBook");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".modal__close");

// Funkcije
function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  document.body.classList.add("no-scroll"); // sprečava skrol pozadine
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

// Event listeneri
btnNewBook.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// ESC za zatvaranje
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
