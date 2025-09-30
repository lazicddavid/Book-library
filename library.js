document.addEventListener("DOMContentLoaded", () => {
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
    document.body.classList.add("no-scroll");
  }
  function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  }

  function render() {
    bookList.innerHTML = "";

    library.forEach((book, index) => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.dataset.index = index;

      card.innerHTML = `
        <h3 class="book-card__title">${book.title}</h3>
        <p class="book-card__meta">
          Autor: ${book.author || "—"} &nbsp;|&nbsp; Strana: ${
        book.pages || "—"
      }
        </p>
        <button class="btn book-card__remove">Obriši</button>
      `;

      bookList.appendChild(card);
    });
  }

  function onAddBook(e) {
    e.preventDefault();

    const title = inputTitle.value.trim();
    const author = inputAuth.value.trim();
    const pages = inputPages.value.trim();

    // pošto su polja required u HTML-u, ovde ne moramo dodatno da proveravamo
    library.push({ title, author, pages });
    render();

    bookForm.reset();
    closeModal();
  }

  function onListClick(e) {
    if (!e.target.classList.contains("book-card__remove")) return;
    const card = e.target.closest(".book-card");
    const idx = Number(card.dataset.index);
    library.splice(idx, 1);
    render();
  }

  btnNewBook.addEventListener("click", openModal);
  btnClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  bookForm.addEventListener("submit", onAddBook);
  bookList.addEventListener("click", onListClick);

  render();
});
