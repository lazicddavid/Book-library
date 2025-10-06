//razbij render funkciju na manje metode, addBookToScreen, removeBookFromScreen
//napravi let varijable za inpute, i sacuvavaj vrednosti iz inputa u njih
//napravi da kad se strikira knjiga da je procitana, to se prikaze u knjizi na ekranu
//ako nije strikirana prikaze se X

// Selectori
const btnNewBook = document.getElementById("btnNewBook");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnClose = document.querySelector(".modal-close");

const bookForm = document.getElementById("bookForm");
const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPages = document.getElementById("pages");
const bookList = document.getElementById("bookList");

// Model
let library = [];

// Traženo: let promenljive za input vrednosti
let titleValue = "";
let authorValue = "";
let pagesValue = "";

// Sync input -> let promenljive
inputTitle.addEventListener("input", (e) => (titleValue = e.target.value));
inputAuthor.addEventListener("input", (e) => (authorValue = e.target.value));
inputPages.addEventListener("input", (e) => (pagesValue = e.target.value));

// Modal
function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

// === RENDER: razbijeno na manje funkcije ===

// Dodaj JEDNU knjigu na ekran
function addBookToScreen(book) {
  const card = document.createElement("div");
  card.className = "book-card";
  card.dataset.id = book.id;

  // status ✓ ili X na osnovu book.read
  const statusSymbol = book.read ? "✓" : "X";

  card.innerHTML = `
    <h3 class="book-card__title">${book.title}</h3>
    <p class="book-card__info">
      Autor: ${book.author || "—"} | Pages: ${book.pages ?? "—"}
    </p>

    <div class="book-card__row">
      <label class="book-card__read">
        <input type="checkbox" class="book-read-checkbox" ${
          book.read ? "checked" : ""
        }>
       Read
      </label>
      <span class="book-card__status" aria-label="status">${statusSymbol}</span>
    </div>

    <button class="btn book-card__remove">Delete book</button>
  `;

  bookList.appendChild(card);
}

// Ukloni JEDNU knjigu sa ekrana
function removeBookFromScreen(id) {
  const el = bookList.querySelector(`.book-card[data-id="${id}"]`);
  if (el) el.remove();
}

// Ponovno iscrtavanje cele liste (poziva addBookToScreen)
function render() {
  bookList.innerHTML = "";
  library.forEach(addBookToScreen);
}

// Handleri
function onAddBook(e) {
  e.preventDefault();

  const title = titleValue.trim();
  if (!title) {
    inputTitle.focus();
    return;
  }

  const author = authorValue.trim();
  const pagesNum =
    pagesValue.trim() === "" ? null : parseInt(pagesValue.trim(), 10);

  const newBook = {
    id: crypto.randomUUID(),
    title,
    author,
    pages: Number.isFinite(pagesNum) ? pagesNum : null,
    read: false, // default: nije pročitana
  };

  library.push(newBook);

  // Dodaj samo novu knjigu na ekran (bez punog rendera)
  addBookToScreen(newBook);

  // Reset forme i let promenljivih
  bookForm.reset();
  titleValue = "";
  authorValue = "";
  pagesValue = "";

  closeModal();
}

function onListClick(e) {
  const target = e.target;

  // Brisanje knjige
  if (target.classList.contains("book-card__remove")) {
    const card = target.closest(".book-card");
    const id = card.dataset.id;

    library = library.filter((b) => b.id !== id);
    removeBookFromScreen(id);
    return;
  }
}

function onListChange(e) {
  // Označavanje „pročitano“
  if (e.target.classList.contains("book-read-checkbox")) {
    const card = e.target.closest(".book-card");
    const id = card.dataset.id;

    const book = library.find((b) => b.id === id);
    if (!book) return;

    book.read = e.target.checked;

    // Ažuriraj simbol na kartici (✓ / X)
    const statusEl = card.querySelector(".book-card__status");
    statusEl.textContent = book.read ? "✓ read" : "X unread";
  }
}

// Close modal samo kad kliknemo VAN modala (po želji)
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

// Events
btnNewBook.addEventListener("click", openModal);
btnClose.addEventListener("click", closeModal);
bookForm.addEventListener("submit", onAddBook);
bookList.addEventListener("click", onListClick);
bookList.addEventListener("change", onListChange);

// Init
render();
