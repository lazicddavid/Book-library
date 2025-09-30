const btnNewBook = document.getElementById("btnNewBook");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnClose = document.querySelector(".modal-close");

const bookForm = document.getElementById("bookForm");
const inputTitle = document.getElementById("title");
const inputAuth = document.getElementById("author");
const inputPages = document.getElementById("pages");
const bookList = document.getElementById("bookList");

let library = [];

function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function render() {
  bookList.innerHTML = "";

  library.forEach((book, index) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.dataset.index = index;

    card.innerHTML = `
  <h3 class="book-card__title">${book.title}</h3>
  <p class="book-card__info">
     Autor: ${book.author || "—"} | Strane: ${book.pages || "—"}
  </p>
  <button class="btn book-card__remove">Delete book</button>
`;

    bookList.appendChild(card);
  });
}

function onAddBook(e) {
  e.preventDefault();

  const title = inputTitle.value.trim();
  if (!title) return;

  const author = inputAuth.value.trim();
  const pagesNum = inputPages.value.trim()
    ? parseInt(inputPages.value, 10)
    : null;

  library.push({ title, author, pages: pagesNum });
  render();

  bookForm.reset();
  closeModal();
}

function onListClick(e) {
  if (!e.target.classList.contains("book-card__remove")) return;

  const card = e.target.closest(".book-card");
  const indexToRemove = Number(card.dataset.index);

  library = library.filter(function (book, index) {
    return index !== indexToRemove;
  });

  render();
}

btnNewBook.addEventListener("click", openModal);
btnClose.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
bookForm.addEventListener("submit", onAddBook);
bookList.addEventListener("click", onListClick);
