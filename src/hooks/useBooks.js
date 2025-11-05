import { useStorage } from './useStorage';

export const useBooks = () => {
  const [books, setBooks, loading] = useStorage('books-data', []);

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now(),
    };
    setBooks([...books, newBook]);
  };

  const updateBook = (bookId, updates) => {
    const updatedBooks = books.map(book => 
      book.id === bookId ? { ...book, ...updates } : book
    );
    setBooks(updatedBooks);
  };

  const deleteBook = (bookId) => {
    setBooks(books.filter(book => book.id !== bookId));
  };

  const clearAllBooks = () => {
    if (window.confirm('Voulez-vous vraiment supprimer TOUTES vos lectures ?')) {
      setBooks([]);
    }
  };

  const importBooks = (newBooks) => {
    setBooks([...books, ...newBooks]);
  };

  const getStats = () => ({
    total: books.length,
    finished: books.filter(b => b.status === 'finished').length,
    reading: books.filter(b => b.status === 'reading').length,
    stopped: books.filter(b => b.status === 'stopped').length
  });

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    clearAllBooks,
    importBooks,
    getStats
  };
};