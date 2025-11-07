import React, { useState } from 'react';
import { useSupabaseBooks } from './hooks/useSupabaseBooks';
import Header from './components/Header';
import Stats from './components/Stats';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import BookGrid from './components/BookGrid';
import ImportModal from './components/ImportModal';
import AddBookModal from './components/AddBookModal';
import BookDetailModal from './components/BookDetailModal';

export default function App() {
  const {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    importBooks,
    getStats
  } = useSupabaseBooks();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleAddBook = async (book) => {
    const result = await addBook(book);
    if (result.success) {
      setShowAddModal(false);
    } else {
      alert('Erreur lors de l\'ajout : ' + result.error);
    }
  };

  const handleUpdateBook = async (bookId, updates) => {
    const result = await updateBook(bookId, updates);
    if (!result.success) {
      alert('Erreur lors de la mise à jour : ' + result.error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    const result = await deleteBook(bookId);
    if (!result.success) {
      alert('Erreur lors de la suppression : ' + result.error);
    }
  };

  const handleImportBooks = async (newBooks) => {
    const result = await importBooks(newBooks);
    if (result.success) {
      setShowImportModal(false);
    } else {
      alert('Erreur lors de l\'import : ' + result.error);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Si onglet "Autre", montrer seulement les "autre"
    if (activeTab === 'autre') {
      return matchesSearch && book.status === 'autre';
    }
    
    // Si onglet "Tous", exclure les "autre"
    if (activeTab === 'all') {
      return matchesSearch && book.status !== 'autre';
    }
    
    // Sinon filtrer normalement par statut
    const matchesTab = book.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-2xl animate-pulse">Chargement de votre bibliothèque...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-2xl">
          <div className="text-red-400 text-xl mb-2">⚠️ Erreur de connexion</div>
          <div className="text-gray-300">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header 
        onImportClick={() => setShowImportModal(true)}
        onAddClick={() => setShowAddModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Stats stats={stats} />
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <FilterTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <BookGrid 
          books={filteredBooks}
          onBookClick={setSelectedBook}
        />
      </div>

      {showImportModal && (
        <ImportModal 
          onClose={() => setShowImportModal(false)}
          onImport={handleImportBooks}
        />
      )}

      {showAddModal && (
        <AddBookModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddBook}
        />
      )}

      {selectedBook && (
        <BookDetailModal 
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={handleUpdateBook}
          onDelete={handleDeleteBook}
        />
      )}
    </div>
  );
}