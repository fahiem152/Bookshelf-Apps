// {
//     id: 3657848524,
//     title: 'Harry Potter and the Philosopher\'s Stone',
//     author: 'J.K Rowling',
//     year: 1997,
//     isComplete: false,
// }

const books = [];
const RENDER_EVENT = 'render-book';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {

        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function makeBook(bookObject) {
    const {
        id,
        title,
        author,
        year,
        isCompleted
    } = bookObject

    const textJudul = document.createElement('h3');
    textJudul.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis: ' + author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + year;


    const textContainer = document.createElement('div');
    textContainer.classList.add('action');



    const conatiner = document.createElement('article');
    conatiner.classList.add('book_item');
    conatiner.append(textJudul, textAuthor, textYear, textContainer);
    conatiner.setAttribute('id', `book-${id}`);

    if (isCompleted) {
        const unreadButton = document.createElement('button');
        unreadButton.classList.add('green');
        unreadButton.innerText = 'Belum selesai di Baca'
        unreadButton.addEventListener('click', function () {
            undoTaskFromCompleted(id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku'
        deleteButton.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });

        textContainer.append(unreadButton, deleteButton);
    } else {
        const readButton = document.createElement('button');
        readButton.classList.add('green');
        readButton.innerText = 'Selesai dibaca'
        readButton.addEventListener('click', function () {
            addTaskCompleted(id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku'
        deleteButton.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });
        textContainer.append(readButton, deleteButton);
    }
    return conatiner;
}

function addBook() {
    const textJudul = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const textIsCompleted = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, textJudul, textAuthor, textYear, textIsCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function addTaskCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId)
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function removeTaskFromCompleted(bookId) {

    var hapusBuku = confirm('Apakah Yakin Menghapus buku ini?')
    if (hapusBuku) {
        const bookTarget = findBookIndex(bookId);
        if (bookTarget === -1) return;
        books.splice(bookTarget, 1);
    } else {
        return null;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}


document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted) {
            completeBookshelfList.append(bookElement);
        } else {
            incompleteBookshelfList.append(bookElement);
        }
    }
})
document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
});

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage')
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function name() {
    console.log(localStorage.getItem(STORAGE_KEY));
})

function loadDataFromStorage() {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);
    if ((data !== null)) {
        for (const book of data) {
            books.push(book);

        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}