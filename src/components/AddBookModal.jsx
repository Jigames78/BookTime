import React, { useState } from 'react';
import { X } from 'lucide-react';
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

  const handleAdd = () => {
    if (newBook.title) {
      const book = {
        ...newBook,
        cover: newBook.cover || getCoverUrl(newBook.title)
      };
      onAdd(book);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{
        background: 'rgba(10, 31, 28, 0.8)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div 
        className="rounded-3xl p-6 max-w-md w-full border" 
        style={{
          background: 'linear-gradient(135deg, rgba(13, 46, 40, 0.98) 0%, rgba(10, 31, 28, 0.98) 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          borderColor: 'rgba(45, 212, 191, 0.3)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
            Ajouter une lecture
          </h2>
          <button 
            onClick={onClose} 
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
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
            onClick={handleAdd}
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
  );
}