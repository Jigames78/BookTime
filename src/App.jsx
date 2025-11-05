import React, { useState } from 'react';
import Header from './components/Header';
import Stats from './components/Stats';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import BookGrid from './components/BookGrid';
import ImportModal from './components/ImportModal';
import AddBookModal from './components/AddBookModal';
import BookDetailModal from './components/BookDetailModal';
import { useBooks } from './hooks/useBooks';

export default function App() {
  const {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    clearAllBooks,
    importBooks,
    getStats
  } = useBooks();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'all' || book.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0a1f1c 0%, #0d2e28 25%, #1a4038 50%, #0d2e28 75%, #0a1f1c 100%)'
      }}>
        <div className="text-teal-300 text-2xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a1f1c 0%, #0d2e28 25%, #1a4038 50%, #0d2e28 75%, #0a1f1c 100%)'
    }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Header 
        onImportClick={() => setShowImportModal(true)}
        onAddClick={() => setShowAddModal(true)}
      />
      <div><p>Hi</p></div>
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <Stats stats={stats} />

        <div className="mb-6">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <FilterTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasBooks={books.length > 0}
            onClearAll={clearAllBooks}
          />
        </div>

        <BookGrid 
          books={filteredBooks}
          onBookClick={setSelectedBook}
        />
      </div>

      {showImportModal && (
        <ImportModal 
          onClose={() => setShowImportModal(false)}
          onImport={(newBooks) => {
            importBooks(newBooks);
            setShowImportModal(false);
          }}
        />
      )}

      {showAddModal && (
        <AddBookModal 
          onClose={() => setShowAddModal(false)}
          onAdd={(book) => {
            addBook(book);
            setShowAddModal(false);
          }}
        />
      )}

      {selectedBook && (
        <BookDetailModal 
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={updateBook}
          onDelete={deleteBook}
        />
      )}
    </div>
  );
}