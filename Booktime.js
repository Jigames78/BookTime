import React, { useState, useEffect } from 'react';
import { Book, Search, Plus, Star, X, Check, Upload, Clock, XCircle, Sparkles } from 'lucide-react';

export default function BookTime() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState('finished');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    cover: '',
    status: 'reading',
    rating: 0,
    episode: '',
    genre: '',
    site: ''
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const result = await window.storage.get('books-data');
      if (result) {
        setBooks(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('Première utilisation');
    }
  };

  const saveBooks = async (updatedBooks) => {
    try {
      await window.storage.set('books-data', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
    }
  };

  const getCoverUrl = (title) => {
    const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/400/600`;
  };

  const parseImportText = () => {
    const lines = importText.split('\n');
    const newBooks = [];
    
    lines.forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#') || line.startsWith('-   ')) {
        return;
      }
      
      line = line.replace(/[🔕❤💙💚💛💜💫♍♈♑⛎🔯♌♐♎🌐🌀]+/g, '').trim();
      
      let title = '';
      let episode = '';
      
      const epMatch = line.match(/^(.+?)\s+ep\s+(.+)$/i);
      if (epMatch) {
        title = epMatch[1].trim();
        episode = epMatch[2].trim();
      } else {
        title = line.trim();
      }
      
      if (title) {
        newBooks.push({
          id: Date.now() + Math.random(),
          title,
          episode,
          site: '',
          status: importStatus,
          cover: getCoverUrl(title),
          rating: 0,
          author: '',
          genre: ''
        });
      }
    });
    
    if (newBooks.length > 0) {
      saveBooks([...books, ...newBooks]);
      setShowImportModal(false);
      setImportText('');
      alert(`${newBooks.length} lecture(s) importée(s) avec succès !`);
    }
  };

  const addBook = () => {
    if (newBook.title) {
      const book = {
        ...newBook,
        id: Date.now(),
        cover: newBook.cover || getCoverUrl(newBook.title)
      };
      saveBooks([...books, book]);
      setShowAddModal(false);
      setNewBook({
        title: '',
        author: '',
        cover: '',
        status: 'reading',
        rating: 0,
        episode: '',
        genre: '',
        site: ''
      });
    }
  };

  const updateBook = (bookId, updates) => {
    const updatedBooks = books.map(book => 
      book.id === bookId ? { ...book, ...updates } : book
    );
    saveBooks(updatedBooks);
    if (selectedBook && selectedBook.id === bookId) {
      setSelectedBook({ ...selectedBook, ...updates });
    }
  };

  const deleteBook = (bookId) => {
    saveBooks(books.filter(book => book.id !== bookId));
    setSelectedBook(null);
  };

  const clearAllBooks = () => {
    if (window.confirm('Voulez-vous vraiment supprimer TOUTES vos lectures ? Cette action est irréversible.')) {
      saveBooks([]);
    }
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'finished': return <Check className="w-4 h-4 text-white" />;
      case 'reading': return <Clock className="w-4 h-4 text-white" />;
      case 'stopped': return <XCircle className="w-4 h-4 text-white" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'finished': return 'bg-gradient-to-br from-emerald-400 to-teal-500';
      case 'reading': return 'bg-gradient-to-br from-cyan-400 to-blue-500';
      case 'stopped': return 'bg-gradient-to-br from-gray-400 to-gray-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a1f1c 0%, #0d2e28 25%, #1a4038 50%, #0d2e28 75%, #0a1f1c 100%)'
    }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <header className="relative backdrop-blur-xl border-b border-teal-500/20 sticky top-0 z-40" style={{
        background: 'linear-gradient(180deg, rgba(13, 46, 40, 0.95) 0%, rgba(10, 31, 28, 0.9) 100%)',
        boxShadow: '0 8px 32px 0 rgba(20, 184, 166, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Book className="w-9 h-9 text-teal-400" style={{filter: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.6))'}} />
                <Sparkles className="w-4 h-4 text-emerald-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent" style={{
                textShadow: '0 0 20px rgba(45, 212, 191, 0.3)'
              }}>BookTime</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all relative group overflow-hidden text-white"
                style={{
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(45, 212, 191, 0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Upload className="w-5 h-5 relative z-10" />
                <span className="hidden sm:inline relative z-10">Import</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all relative group overflow-hidden text-white"
                style={{
                  background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
                  boxShadow: '0 4px 15px rgba(45, 212, 191, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(94, 234, 212, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Plus className="w-5 h-5 relative z-10" />
                <span className="hidden sm:inline relative z-10">Ajouter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, gradient: 'from-teal-500/20 to-emerald-500/20', border: 'border-teal-400/30', text: 'text-teal-300', glow: 'rgba(45, 212, 191, 0.2)' },
            { label: 'Terminés', value: stats.finished, gradient: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-400/30', text: 'text-emerald-300', glow: 'rgba(16, 185, 129, 0.2)' },
            { label: 'En cours', value: stats.reading, gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-400/30', text: 'text-cyan-300', glow: 'rgba(34, 211, 238, 0.2)' },
            { label: 'Arrêtés', value: stats.stopped, gradient: 'from-gray-500/20 to-slate-500/20', border: 'border-gray-400/30', text: 'text-gray-300', glow: 'rgba(148, 163, 184, 0.2)' }
          ].map((stat, i) => (
            <div key={i} className={`backdrop-blur-xl rounded-2xl p-6 border ${stat.border} bg-gradient-to-br ${stat.gradient} transition-all hover:scale-105`} style={{
              boxShadow: `0 8px 32px ${stat.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`
            }}>
              <div className={`${stat.text} text-sm mb-2 font-semibold uppercase tracking-wide`}>{stat.label}</div>
              <div className="text-5xl font-bold text-white" style={{textShadow: `0 0 20px ${stat.glow}`}}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" style={{filter: 'drop-shadow(0 0 4px rgba(45, 212, 191, 0.6))'}} />
            <input
              type="text"
              placeholder="Rechercher un titre ou un auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl pl-12 pr-4 py-4 text-white placeholder-teal-300/50 focus:outline-none transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(13, 46, 40, 0.8) 100%)',
                boxShadow: '0 4px 20px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)'
              }}
            />
          </div>
          
          <div className="flex gap-3 flex-wrap items-center">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'reading', label: 'En cours' },
              { key: 'finished', label: 'Terminés' },
              { key: 'stopped', label: 'Arrêtés' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.key ? 'scale-105 text-white' : 'scale-100 opacity-70 hover:opacity-100'
                }`}
                style={activeTab === tab.key ? {
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.2)'
                } : {
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  color: 'rgb(153, 246, 228)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {tab.label}
              </button>
            ))}
            {books.length > 0 && (
              <button
                onClick={clearAllBooks}
                className="ml-auto px-4 py-2.5 rounded-xl text-sm transition-all backdrop-blur-lg hover:scale-105"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: 'rgb(252, 165, 165)'
                }}
              >
                Tout effacer
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl transition-all duration-500 group-hover:scale-110" style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.2)'
              }}>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  background: 'linear-gradient(to top, rgba(10, 31, 28, 0.95) 0%, rgba(13, 46, 40, 0.7) 50%, transparent 100%)'
                }}>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-white font-bold text-sm mb-1 line-clamp-2 drop-shadow-lg">{book.title}</div>
                    {book.author && <div className="text-teal-200 text-xs mb-1 drop-shadow">{book.author}</div>}
                    {book.episode && <div className="text-emerald-300 text-xs font-semibold drop-shadow">Ép {book.episode}</div>}
                  </div>
                </div>
                <div className={`absolute top-3 left-3 ${getStatusColor(book.status)} rounded-full p-2 shadow-xl`} style={{
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}>
                  {getStatusIcon(book.status)}
                </div>
                {book.rating > 0 && (
                  <div className="absolute top-3 right-3 rounded-full px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-lg" style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.95) 0%, rgba(245, 158, 11, 0.95) 100%)',
                    boxShadow: '0 4px 15px rgba(251, 191, 36, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}>
                    <Star className="w-3.5 h-3.5 fill-white text-white drop-shadow" />
                    <span className="text-white text-xs font-bold drop-shadow">{book.rating}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 px-1">
                <div className="text-teal-100 font-semibold text-sm line-clamp-1 drop-shadow">{book.title}</div>
                {book.episode && <div className="text-teal-400/70 text-xs mt-0.5">Épisode {book.episode}</div>}
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-24">
            <div className="relative inline-block">
              <Book className="w-24 h-24 text-teal-500/30 mx-auto mb-6" />
              <Sparkles className="w-8 h-8 text-emerald-400 absolute top-0 right-0 animate-pulse" />
            </div>
            <p className="text-teal-200 text-xl font-semibold mb-2">Aucune lecture trouvée</p>
            <p className="text-teal-400/60">Utilisez le bouton Import pour ajouter vos listes !</p>
          </div>
        )}
      </div>

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
          background: 'rgba(10, 31, 28, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="rounded-3xl p-6 max-w-2xl w-full border max-h-[90vh] overflow-y-auto" style={{
            background: 'linear-gradient(135deg, rgba(13, 46, 40, 0.98) 0%, rgba(10, 31, 28, 0.98) 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            borderColor: 'rgba(45, 212, 191, 0.3)'
          }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">Importer vos lectures</h2>
              <button onClick={() => setShowImportModal(false)} className="text-teal-400 hover:text-teal-300 transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-teal-200 text-sm mb-2 block font-semibold uppercase tracking-wide">Statut des lectures</label>
                <select
                  value={importStatus}
                  onChange={(e) => setImportStatus(e.target.value)}
                  className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                  }}
                >
                  <option value="finished">Terminés (ENDING)</option>
                  <option value="reading">En cours (ONGOING)</option>
                  <option value="stopped">Arrêtés (STOP)</option>
                </select>
              </div>

              <div>
                <label className="text-teal-200 text-sm mb-2 block font-semibold uppercase tracking-wide">
                  Collez votre liste ici
                </label>
                <div className="text-teal-300/80 text-xs mb-3 p-4 rounded-xl backdrop-blur-lg" style={{
                  background: 'rgba(6, 78, 59, 0.3)',
                  border: '1px solid rgba(45, 212, 191, 0.2)'
                }}>
                  <div className="font-semibold mb-2">Format accepté :</div>
                  • Solo Leveling ep 179 End<br/>
                  • Nano Machine ep 212<br/>
                  • True beauty ep 223<br/>
                  <div className="mt-2 text-emerald-300">✨ Les emojis sont automatiquement supprimés</div>
                  <div className="text-emerald-300">✨ Les images sont générées automatiquement</div>
                </div>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Collez votre liste complète ici...&#10;Vous pouvez coller des centaines de lignes d'un coup !"
                  rows={15}
                  className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white placeholder-teal-300/40 focus:outline-none font-mono text-sm transition-all"
                  style={{
                    background: 'rgba(6, 78, 59, 0.2)',
                    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.03)'
                  }}
                />
                <div className="text-teal-300 text-xs mt-2 font-semibold">
                  {importText.split('\n').filter(line => line.trim() && !line.startsWith('#')).length} lignes détectées
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={parseImportText}
                  disabled={!importText.trim()}
                  className="flex-1 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-white"
                  style={{
                    background: !importText.trim() ? 'rgba(100, 116, 139, 0.3)' : 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    boxShadow: !importText.trim() ? 'none' : '0 4px 20px rgba(20, 184, 166, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                    border: '1px solid rgba(45, 212, 191, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10">Importer</span>
                </button>
                <button
                  onClick={() => setImportText('')}
                  className="px-6 py-3.5 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    color: 'rgb(153, 246, 228)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Effacer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
          background: 'rgba(10, 31, 28, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="rounded-3xl p-6 max-w-md w-full border" style={{
            background: 'linear-gradient(135deg, rgba(13, 46, 40, 0.98) 0%, rgba(10, 31, 28, 0.98) 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            borderColor: 'rgba(45, 212, 191, 0.3)'
          }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">Ajouter une lecture</h2>
              <button onClick={() => setShowAddModal(false)} className="text-teal-400 hover:text-teal-300 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Titre *"
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white placeholder-teal-300/50 focus:outline-none transition-all"
                style={{
                  background: 'rgba(20, 184, 166, 0.1)',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              />
              
              <input
                type="text"
                placeholder="Auteur"
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white placeholder-teal-300/50 focus:outline-none transition-all"
                style={{
                  background: 'rgba(20, 184, 166, 0.1)',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              />

              <input
                type="text"
                placeholder="Épisode actuel (ex: 45, 120 End)"
                value={newBook.episode}
                onChange={(e) => setNewBook({...newBook, episode: e.target.value})}
                className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white placeholder-teal-300/50 focus:outline-none transition-all"
                style={{
                  background: 'rgba(20, 184, 166, 0.1)',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              />

              <input
                type="text"
                placeholder="Genre"
                value={newBook.genre}
                onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white placeholder-teal-300/50 focus:outline-none transition-all"
                style={{
                  background: 'rgba(20, 184, 166, 0.1)',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              />

              <input
                type="text"
                placeholder="Site web"
                value={newBook.site}
                onChange={(e) => setNewBook({...newBook, site: e.target.value})}
                className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white placeholder-teal-300/50 focus:outline-none transition-all"
                style={{
                  background: 'rgba(20, 184, 166, 0.1)',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              />
              
              <select
                value={newBook.status}
                onChange={(e) => setNewBook({...newBook, status: e.target.value})}
                className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                style={{
                  background: 'rgba(20, 184, 166, 0.1)',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                <option value="reading">En cours</option>
                <option value="finished">Terminé</option>
                <option value="stopped">Arrêté</option>
              </select>

              <div>
                <label className="text-teal-200 text-sm mb-2 block font-semibold">Note (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={newBook.rating}
                  onChange={(e) => setNewBook({...newBook, rating: parseInt(e.target.value) || 0})}
                  className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                  }}
                />
              </div>
              
              <button
                onClick={addBook}
                disabled={!newBook.title}
                className="w-full py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-white"
                style={{
                  background: !newBook.title ? 'rgba(100, 116, 139, 0.3)' : 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  boxShadow: !newBook.title ? 'none' : '0 4px 20px rgba(20, 184, 166, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(45, 212, 191, 0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">Ajouter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
          background: 'rgba(10, 31, 28, 0.8)',
          backdropFilter: 'blur(10px)'
        }} onClick={() => setSelectedBook(null)}>
          <div className="rounded-3xl p-6 max-w-2xl w-full border max-h-[90vh] overflow-y-auto" style={{
            background: 'linear-gradient(135deg, rgba(13, 46, 40, 0.98) 0%, rgba(10, 31, 28, 0.98) 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            borderColor: 'rgba(45, 212, 191, 0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-6">
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className="w-48 h-72 object-cover rounded-2xl shadow-2xl"
                style={{boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.2)'}}
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent pr-4">{selectedBook.title}</h2>
                  <button onClick={() => setSelectedBook(null)} className="text-teal-400 hover:text-teal-300 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {selectedBook.author && <p className="text-teal-200 mb-3">Par {selectedBook.author}</p>}
                
                <div className="space-y-4">
                  <div>
                    <label className="text-teal-200 text-sm mb-2 block font-semibold">Statut</label>
                    <select
                      value={selectedBook.status}
                      onChange={(e) => updateBook(selectedBook.id, { status: e.target.value })}
                      className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      style={{
                        background: 'rgba(20, 184, 166, 0.1)',
                        boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                    >
                      <option value="reading">En cours</option>
                      <option value="finished">Terminé</option>
                      <option value="stopped">Arrêté</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-teal-200 text-sm mb-2 block font-semibold">Épisode</label>
                    <input
                      type="text"
                      value={selectedBook.episode}
                      onChange={(e) => updateBook(selectedBook.id, { episode: e.target.value })}
                      placeholder="Ex: 45, 120 End"
                      className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white placeholder-teal-300/50 focus:outline-none transition-all"
                      style={{
                        background: 'rgba(20, 184, 166, 0.1)',
                        boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-teal-200 text-sm mb-2 block font-semibold">Note (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={selectedBook.rating}
                      onChange={(e) => updateBook(selectedBook.id, { rating: parseInt(e.target.value) || 0 })}
                      className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      style={{
                        background: 'rgba(20, 184, 166, 0.1)',
                        boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                    />
                  </div>

                  {selectedBook.genre && (
                    <div>
                      <label className="text-teal-200 text-sm mb-1 block font-semibold">Genre</label>
                      <p className="text-white">{selectedBook.genre}</p>
                    </div>
                  )}

                  {selectedBook.site && (
                    <div>
                      <label className="text-teal-200 text-sm mb-1 block font-semibold">Site</label>
                      <a href={selectedBook.site} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 underline">
                        {selectedBook.site}
                      </a>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette lecture ?')) {
                        deleteBook(selectedBook.id);
                      }
                    }}
                    className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-105"
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: 'rgb(252, 165, 165)'
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}