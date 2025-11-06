import React, { useState } from 'react';
import { useStorage } from './hooks/useStorage';
import { themes } from './utils/themes';
import Header from './components/Header';
import Stats from './components/Stats';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import BookGrid from './components/BookGrid';
import ImportModal from './components/ImportModal';
import AddBookModal from './components/AddBookModal';
import BookDetailModal from './components/BookDetailModal';

export default function App() {
  const [books, setBooks, loading] = useStorage('books-collection', []);
  const [theme, setTheme] = useStorage('app-theme', 'dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const currentTheme = themes[theme];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const addBook = (book) => {
    const newBook = { ...book, id: Date.now() };
    setBooks([...books, newBook]);
    setShowAddModal(false);
  };

  const updateBook = (bookId, updates) => {
    setBooks(books.map(book => book.id === bookId ? { ...book, ...updates } : book));
  };

  const deleteBook = (bookId) => {
    setBooks(books.filter(book => book.id !== bookId));
  };

  const importBooks = (newBooks) => {
    setBooks([...books, ...newBooks]);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'all' || book.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: books.length,
    finished: books.filter(b => b.status === 'finished').length,
    reading: books.filter(b => b.status === 'reading').length,
    stopped: books.filter(b => b.status === 'stopped').length
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${currentTheme.bg}`}>
        <div className={`${currentTheme.text} text-2xl animate-pulse`}>Chargement...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg}`}>
      <Header 
        theme={theme}
        onToggleTheme={toggleTheme}
        onImportClick={() => setShowImportModal(true)}
        onAddClick={() => setShowAddModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Stats stats={stats} theme={theme} />
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          theme={theme}
        />
        <FilterTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          theme={theme}
        />
        <BookGrid 
          books={filteredBooks}
          onBookClick={setSelectedBook}
          theme={theme}
        />
      </div>

      {showImportModal && (
        <ImportModal 
          onClose={() => setShowImportModal(false)}
          onImport={importBooks}
          theme={theme}
        />
      )}

      {showAddModal && (
        <AddBookModal 
          onClose={() => setShowAddModal(false)}
          onAdd={addBook}
          theme={theme}
        />
      )}

      {selectedBook && (
        <BookDetailModal 
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={updateBook}
          onDelete={deleteBook}
          theme={theme}
        />
      )}
    </div>
  );
}