//edit : na klik dugmeta edit,
//naci knjigu sa tim ID-em,
//zameniti tu knjigu na ekranu sa formom,
//preko CSS napravi da izgleda isto kao obicna knjga
//paragrafe (name, author...) zameniti inputima,
//inpute popuniti vrednostima iz polja koja odgovaraju toj knjizi
//sva dugmat zameniti (delete, read...) jednim dugmetom finish editing,
//na klik dugmeta finish editing, ili na enter, pokupiti vrednos iz inputa.
//naci knjigu u array i apdejtovati joj vrednosti,
//ponovo zameniti knjigu - iz forme u list element sa novim vrednostima

const btnNewBook = document.getElementById("btnNewBook");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnClose = document.querySelector(".modal-close");
const bookForm = document.getElementById("bookForm");
const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPages = document.getElementById("pages");
const bookList = document.getElementById("bookList");
const inputRead = document.getElementById("read");

let library = [];
let readValue = false;
let titleValue = "";
let authorValue = "";
let pagesValue = "";

inputTitle.addEventListener("input", (e) => (titleValue = e.target.value));
inputAuthor.addEventListener("input", (e) => (authorValue = e.target.value));
inputPages.addEventListener("input", (e) => (pagesValue = e.target.value));
inputRead.addEventListener("change", (e) => (readValue = e.target.checked));

function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function addBookToScreen(book) {
  const card = document.createElement("div");
  card.className = "book-card";
  card.dataset.id = book.id;

  const statusText = book.read ? "✓ read" : "X unread";

  card.innerHTML = `
    <h3 class="book-card__title">${book.title}</h3>
    <p class="book-card__info">
      Author: ${book.author || "—"} | Pages: ${book.pages ?? "—"}
    </p>

    <div class="book-card__row">
      <label class="book-card__read">
        <input
          type="checkbox"
          class="book-read-checkbox"
          ${book.read ? "checked" : ""}
          aria-label="Toggle read status"
          title="Toggle read status"
        >
      </label>
      <span class="book-card__status" aria-live="polite">${statusText}</span>
    </div>

 
  <button class="btn book-card__remove">Delete book</button>
  <button class="btn book-card__edit">Edit</button>


  `;

  bookList.appendChild(card);
}

function removeBookFromScreen(id) {
  const el = bookList.querySelector(`.book-card[data-id="${id}"]`);
  if (el) el.remove();
}

function render() {
  bookList.innerHTML = "";
  library.forEach(addBookToScreen);
}

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
    read: readValue,
  };

  library.push(newBook);
  addBookToScreen(newBook);

  bookForm.reset();
  titleValue = "";
  authorValue = "";
  pagesValue = "";

  closeModal();
}

function onListClick(e) {
  const card = e.target.closest(".book-card");
  if (!card) return;
  const id = card.dataset.id;

  //brisanje
  if (e.target.classList.contains("book-card__remove")) {
    library = library.filter((b) => b.id !== id);
    removeBookFromScreen(id);
    return;
  }

  //editovanje
  if (e.target.classList.contains("book-card__edit")) {
    const book = library.find((b) => b.id === id);
    if (!book) return;

    const titleEl = card.querySelector(".book-card__title");
    const infoEl = card.querySelector(".book-card__info");
    const readRow = card
      .querySelector(".book-read-checkbox")
      ?.closest(".book-card__row");
    const btnRemove = card.querySelector(".book-card__remove");
    const btnEdit = card.querySelector(".book-card__edit");

    const isEditing = card.dataset.editing === "1";
    //edit opcija
    if (!isEditing) {
      titleEl.innerHTML = `<input class="edit-input edit-title" value="${
        book.title || ""
      }">`;
      infoEl.innerHTML = `
        <input class="edit-input edit-author" value="${
          book.author || ""
        }" placeholder="Author">
        <input class="edit-input edit-pages" type="number" value="${
          book.pages ?? ""
        }" placeholder="Pages">
      `;
      if (readRow) readRow.style.display = "none";
      if (btnRemove) btnRemove.style.display = "none";

      btnEdit.textContent = "Finish editing";
      card.dataset.editing = "1";
      titleEl.querySelector(".edit-title").focus();

      //enter za potrvrdu
      card
        .querySelectorAll(".edit-title, .edit-author, .edit-pages")
        .forEach((inp) => {
          inp.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              btnEdit.click();
            }
          });
        });
      return;
    }

    const newTitle = titleEl.querySelector(".edit-title").value.trim();
    const newAuthor = infoEl.querySelector(".edit-author").value.trim();
    const pagesRaw = infoEl.querySelector(".edit-pages").value.trim();
    const pagesNum = pagesRaw === "" ? null : parseInt(pagesRaw, 10);
    if (!newTitle) {
      titleEl.querySelector(".edit-title").focus();
      return;
    }

    book.title = newTitle;
    book.author = newAuthor;
    book.pages = Number.isFinite(pagesNum) ? pagesNum : null;

    titleEl.textContent = book.title;
    infoEl.textContent = `Author: ${book.author || "—"} | Pages: ${
      book.pages ?? "—"
    }`;

    if (readRow) readRow.style.display = "";
    if (btnRemove) btnRemove.style.display = "";
    btnEdit.textContent = "Edit";
    card.dataset.editing = "0";
  }
}

function onListChange(e) {
  if (e.target.classList.contains("book-read-checkbox")) {
    const card = e.target.closest(".book-card");
    const id = card.dataset.id;

    const book = library.find((b) => b.id === id);
    if (!book) return;

    book.read = e.target.checked;

    const statusEl = card.querySelector(".book-card__status");
    statusEl.textContent = book.read ? "✓ read" : "X unread";
  }
}

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

btnNewBook.addEventListener("click", openModal);
btnClose.addEventListener("click", closeModal);
bookForm.addEventListener("submit", onAddBook);
bookList.addEventListener("click", onListClick);
bookList.addEventListener("change", onListChange);

render();
