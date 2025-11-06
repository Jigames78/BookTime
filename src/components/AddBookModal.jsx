import React, { useState } from 'react';
import { X } from 'lucide-react';
import { themes } from '../utils/themes';
import { getCoverUrl } from '../utils/imageGenerator';

export default function AddBookModal({ onClose, onAdd, theme }) {
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
  const currentTheme = themes[theme];

  const handleAdd = () => {
    if (newBook.title) {
      onAdd({
        ...newBook,
        cover: newBook.cover || getCoverUrl(newBook.title)
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg"
      style={{ background: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}
    >
      <div 
        className="rounded-3xl p-6 max-w-md w-full border"
        style={{
          background: currentTheme.cardBg,
          borderColor: currentTheme.border,
          boxShadow: theme === 'dark' ? '0 0 60px rgba(0, 0, 0, 0.8)' : '0 0 60px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Ajouter une lecture</h2>
          <button onClick={onClose} className={currentTheme.textSecondary + ' hover:opacity-70'}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Titre *"
            value={newBook.title}
            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
            className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
            style={{
              background: currentTheme.inputBg,
              borderColor: currentTheme.border
            }}
          />
          <input
            type="text"
            placeholder="Auteur"
            value={newBook.author}
            onChange={(e) => setNewBook({...newBook, author: e.target.value})}
            className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
            style={{
              background: currentTheme.inputBg,
              borderColor: currentTheme.border
            }}
          />
          <input
            type="text"
            placeholder="Épisode"
            value={newBook.episode}
            onChange={(e) => setNewBook({...newBook, episode: e.target.value})}
            className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
            style={{
              background: currentTheme.inputBg,
              borderColor: currentTheme.border
            }}
          />
          <select
            value={newBook.status}
            onChange={(e) => setNewBook({...newBook, status: e.target.value})}
            className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
            style={{
              background: currentTheme.inputBg,
              borderColor: currentTheme.border
            }}
          >
            <option value="reading">En cours</option>
            <option value="finished">Terminé</option>
            <option value="stopped">Arrêté</option>
          </select>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Note (0-10)"
            value={newBook.rating}
            onChange={(e) => setNewBook({...newBook, rating: parseInt(e.target.value) || 0})}
            className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
            style={{
              background: currentTheme.inputBg,
              borderColor: currentTheme.border
            }}
          />
          
          <button
            onClick={handleAdd}
            disabled={!newBook.title}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 disabled:opacity-50"
            style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}