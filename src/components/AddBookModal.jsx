import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { getCoverUrl } from '../utils/imageGenerator';

export default function AddBookModal({ onClose, onAdd }) {
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
  const [searching, setSearching] = useState(false);

  const handleAdd = async () => {
    if (newBook.title) {
      setSearching(true);
      
      // Toujours chercher automatiquement la vraie couverture
      const coverUrl = await getCoverUrl(newBook.title);
      
      onAdd({
        ...newBook,
        cover: coverUrl
      });
      
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-black/80" onClick={onClose}>
      <div className="rounded-3xl p-6 max-w-md w-full border border-gray-700 bg-gray-800/95" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Ajouter une lecture</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Titre *"
            value={newBook.title}
            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
            className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Auteur"
            value={newBook.author}
            onChange={(e) => setNewBook({...newBook, author: e.target.value})}
            className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Épisode"
            value={newBook.episode}
            onChange={(e) => setNewBook({...newBook, episode: e.target.value})}
            className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white placeholder-gray-500"
          />
          
          <select
            value={newBook.status}
            onChange={(e) => setNewBook({...newBook, status: e.target.value})}
            className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white"
          >
            <option value="reading">En cours</option>
            <option value="finished">Terminé</option>
            <option value="stopped">Arrêté</option>
            <option value="autre">Autre</option>
          </select>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Note (0-10)"
            value={newBook.rating}
            onChange={(e) => setNewBook({...newBook, rating: parseInt(e.target.value) || 0})}
            className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white placeholder-gray-500"
          />
          
          <div className="p-3 bg-teal-900/20 border border-teal-700 rounded-xl">
            <p className="text-xs text-teal-300">✨ La couverture sera recherchée automatiquement sur AniList et Google Books</p>
          </div>
          
          <button
            onClick={handleAdd}
            disabled={!newBook.title || searching}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2"
            style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
          >
            {searching ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Recherche de la couverture...
              </>
            ) : (
              'Ajouter'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}