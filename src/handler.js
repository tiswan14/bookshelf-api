/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */

const {
  nanoid
} = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    insertedAt,
    updatedAt,
    finished
  };
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((b) => b.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished
  } = request.query;

  if (books.length === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: []
      }
    });

    response.code(200);
    return response;
  }

  let screeningBooks = books;

  if (name) {
    screeningBooks = books.filter((b) =>
      b.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading) {
    screeningBooks = books.filter((b) => Number(b.reading) === Number(reading));
  }

  if (finished) {
    screeningBooks = books.filter(
      (b) => Number(b.finished) === Number(finished)
    );
  }

  const listOfMyBooks = screeningBooks.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: listOfMyBooks
    }
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {
    id
  } = request.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {
    id
  } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((b) => b.id === id);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {
    id
  } = request.params;
  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};