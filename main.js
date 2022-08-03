const [incompleteBookself, completeBookself, inputModal, bookCreate, bookCancel] = [document.getElementById('incompleteBookshelfList'), document.getElementById('completeBookshelfList'), document.getElementById("inputModal"), document.getElementById("bookCreate"), document.getElementById('bookCancel')];
const [books, BOOK_KEY] = [[], 'bookKey'];
const [inputTitle, inputAuthor, inputYear, inputIsComplete, inputSectionTitle] = [document.getElementById('inputBookTitle'), document.getElementById('inputBookAuthor'), document.getElementById('inputBookYear'), document.getElementById('inputBookIsComplete'), document.querySelector('.modal-content h2')];

function loadSearch() {
  localStorage.setItem(BOOK_KEY, JSON.stringify(books));
  [incompleteBookself.innerHTML, completeBookself.innerHTML] = ['', ''];
  inputModal.style.display = "none";
  const search = books.filter(s => s.title.includes(document.getElementById('searchBookTitle').value));
  search.forEach(book => {
    const item = setElement(book);
    if (book.isComplete) completeBookself.appendChild(item);
    else incompleteBookself.appendChild(item);
  })
}

function loadElement() {
  localStorage.setItem(BOOK_KEY, JSON.stringify(books));
  [incompleteBookself.innerHTML, completeBookself.innerHTML] = ['', ''];
  books.forEach(book => {
      const item = setElement(book);
      if (book.isComplete) completeBookself.appendChild(item);
      else incompleteBookself.appendChild(item);
  });
}

function setElement(book) {
  const bookItem = document.createElement('article');
  bookItem.className = 'book_item';
  const bookContent = document.createElement('div');
  bookContent.className = 'content';
  bookContent.innerHTML += `<h3>${book.title}</h3>`;
  bookContent.innerHTML += `<p>Penulis: ${book.author}</p>`;
  bookContent.innerHTML += `<p>Tahun: ${book.year}</p>`;
  const bookAction = document.createElement('div'); 
  bookAction.className = 'action';
  const actionButton = document.createElement('button');
  actionButton.className = 'green';
  if (book.isComplete) actionButton.innerText = 'Belum selesai di Baca';
  else actionButton.innerText = 'Selesai dibaca';
  actionButton.onclick = () => actionEvent(book.id, book.isComplete);
  const editButton = document.createElement('button');
  editButton.className = 'orange';
  editButton.innerText = 'Edit buku';
  editButton.onclick = () => editEvent(book.id);
  const deleteButton = document.createElement('button');
  deleteButton.className = 'red';
  deleteButton.innerText = 'Hapus buku';
  deleteButton.onclick = () => deleteEvent(book.id);
  bookAction.append(actionButton, editButton, deleteButton);
  bookItem.append(bookContent, bookAction);
  return bookItem;
}

function actionEvent(bookId, isComplete) {
  const book = books.find(s => s.id === bookId);
  if (book == null) return;
  book.isComplete = !isComplete;
  loadSearch();
}

function validInput() {
  if (inputTitle.value === '' || inputAuthor.value === '' || inputYear.value === '') {
    let message; 
    message = inputTitle.value === ''?'"Input Judul" ':'';
    message += inputAuthor.value === ''?'"Input Penulis" ':'';
    message += inputYear.value === ''?'"Input Tahun" ':'';
    alert(`${message}tidak boleh kosong!`);
    return false;
  }
  return true;
}

function storeEvent(event) {
  event.preventDefault();
  if(!validInput()) return;
  const book = {
      id: +new Date(),
      title: inputTitle.value,
      author: inputAuthor.value,
      year: parseInt(inputYear.value),
      isComplete: inputIsComplete.checked
  }
  books.push(book);
  loadSearch();
}

function editEvent(bookId) {
  const book = books.find(s => s.id === bookId);
  if (book == null) return;
  document.querySelector('.input_section').scrollIntoView();
  inputModal.style.display = "block"; 
  setInput(book, true);
}

function updateEvent(event, bookId) {
  event.preventDefault();
  const book = books.find(s => s.id === bookId);
  if (book == null) return;
  if(!validInput()) return;
  book.title = inputTitle.value;
  book.author = inputAuthor.value;
  book.year = parseInt(inputYear.value);
  book.isComplete = inputIsComplete.checked;
  loadSearch();
  setInput();
}

function deleteEvent(bookId) {
  const index = books.findIndex(s => s.id === bookId);
  if (index === -1) return;
  if (confirm(`Anda yakin untuk menghapus buku yang berjudul "${books.find(s => s.id === bookId).title}"?`)) {
      books.splice(index, 1);
      loadSearch();
  }
}

function setInput(book = null, onUpdate = false) {
  let updateBook, submitBook;
  if (onUpdate) {
      [inputTitle.value, inputAuthor.value, inputYear.value, inputIsComplete.checked] = [book.title, book.author, book.year, book.isComplete];
      inputSectionTitle.innerText = `Update Buku "${book.title}"`;
      try { updateBook = document.getElementById('bookSubmit'); updateBook.id = 'bookUpdate'; } catch { updateBook = document.getElementById('bookUpdate'); }
      updateBook.id = 'bookUpdate';
      updateBook.innerHTML = '<span>Update Buku<span>';
      updateBook.onclick = e => updateEvent(e, book.id);
  } else {
      [inputTitle.value, inputAuthor.value, inputYear.value, inputIsComplete.checked] = ['', '', '', false];
      inputSectionTitle.innerText = 'Masukkan Buku Baru';
      try { submitBook = document.getElementById('bookSubmit'); submitBook.id = 'bookSubmit'; } catch { submitBook = document.getElementById('bookUpdate'); }
      submitBook.id = 'bookSubmit';
      submitBook.innerHTML = '<span>Simpan Buku</span>';
      submitBook.onclick = e => storeEvent(e);
  }
}

window.onload = () => {
  if (typeof(Storage) !== undefined) {
      const data = JSON.parse(localStorage.getItem(BOOK_KEY));
      if (data !== null) for (const book of data) books.push(book);
      document.getElementById('bookSubmit').onclick = e => storeEvent(e);
      bookCancel.onclick = e => { e.preventDefault(); inputModal.style.display = "none"; };
      bookCreate.onclick = () => { inputModal.style.display = "block"; setInput(); };
      loadElement();
      document.getElementById('searchSubmit').onclick = e => { e.preventDefault(); loadSearch(); };
  }
  else alert('Browser Anda tidak mendukung Web Storage!');
}


