import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { themes } from '../utils/themes';

export default function BookDetailModal({ book, onClose, onUpdate, onDelete, theme }) {
  const [editedBook, setEditedBook] = useState(book);
  const [imageUrl, setImageUrl] = useState(book.cover);
  const currentTheme = themes[theme];

  const handleSave = () => {
    onUpdate(book.id, { ...editedBook, cover: imageUrl });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg"
      style={{ background: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-3xl p-6 max-w-2xl w-full border max-h-[90vh] overflow-y-auto"
        style={{
          background: currentTheme.cardBg,
          borderColor: currentTheme.border,
          boxShadow: theme === 'dark' 
            ? '0 0 60px rgba(0, 0, 0, 0.8), 0 20px 60px rgba(0,0,0,0.8)'
            : '0 0 60px rgba(0, 0, 0, 0.2), 0 20px 60px rgba(0,0,0,0.1)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={editedBook.title}
              className="w-48 h-72 object-cover rounded-2xl shadow-2xl border"
              style={{ borderColor: currentTheme.border }}
            />
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL de l'image"
              className={`w-48 mt-3 border rounded-lg px-3 py-2 text-xs ${currentTheme.text}`}
              style={{
                background: currentTheme.inputBg,
                borderColor: currentTheme.border
              }}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <input
                type="text"
                value={editedBook.title}
                onChange={(e) => setEditedBook({...editedBook, title: e.target.value})}
                className={`text-3xl font-bold bg-transparent border-b-2 pr-4 focus:outline-none ${currentTheme.text}`}
                style={{ borderColor: currentTheme.border }}
              />
              <button onClick={onClose} className={currentTheme.textSecondary + ' hover:opacity-70'}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`${currentTheme.textSecondary} text-sm mb-2 block`}>Auteur</label>
                <input
                  type="text"
                  value={editedBook.author}
                  onChange={(e) => setEditedBook({...editedBook, author: e.target.value})}
                  className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
                  style={{
                    background: currentTheme.inputBg,
                    borderColor: currentTheme.border
                  }}
                />
              </div>

              <div>
                <label className={`${currentTheme.textSecondary} text-sm mb-2 block`}>Statut</label>
                <select
                  value={editedBook.status}
                  onChange={(e) => setEditedBook({...editedBook, status: e.target.value})}
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
              </div>

              <div>
                <label className={`${currentTheme.textSecondary} text-sm mb-2 block`}>Épisode</label>
                <input
                  type="text"
                  value={editedBook.episode}
                  onChange={(e) => setEditedBook({...editedBook, episode: e.target.value})}
                  className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
                  style={{
                    background: currentTheme.inputBg,
                    borderColor: currentTheme.border
                  }}
                />
              </div>

              <div>
                <label className={`${currentTheme.textSecondary} text-sm mb-2 block`}>Genre</label>
                <input
                  type="text"
                  value={editedBook.genre}
                  onChange={(e) => setEditedBook({...editedBook, genre: e.target.value})}
                  className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
                  style={{
                    background: currentTheme.inputBg,
                    borderColor: currentTheme.border
                  }}
                />
              </div>

              <div>
                <label className={`${currentTheme.textSecondary} text-sm mb-2 block`}>Site web</label>
                <input
                  type="text"
                  value={editedBook.site}
                  onChange={(e) => setEditedBook({...editedBook, site: e.target.value})}
                  className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
                  style={{
                    background: currentTheme.inputBg,
                    borderColor: currentTheme.border
                  }}
                />
              </div>

              <div>
                <label className={`${currentTheme.textSecondary} text-sm mb-2 block`}>Note (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={editedBook.rating}
                  onChange={(e) => setEditedBook({...editedBook, rating: parseInt(e.target.value) || 0})}
                  className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
                  style={{
                    background: currentTheme.inputBg,
                    borderColor: currentTheme.border
                  }}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all"
                  style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Supprimer cette lecture ?')) {
                      onDelete(book.id);
                      onClose();
                    }
                  }}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500"
                  style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}