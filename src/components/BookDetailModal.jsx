import React from 'react';
import { X } from 'lucide-react';

export default function BookDetailModal({ book, onClose, onUpdate, onDelete }) {
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette lecture ?')) {
      onDelete(book.id);
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
      onClick={onClose}
    >
      <div 
        className="rounded-3xl p-6 max-w-2xl w-full border max-h-[90vh] overflow-y-auto" 
        style={{
          background: 'linear-gradient(135deg, rgba(13, 46, 40, 0.98) 0%, rgba(10, 31, 28, 0.98) 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          borderColor: 'rgba(45, 212, 191, 0.3)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-6">
          <img
            src={book.cover}
            alt={book.title}
            className="w-48 h-72 object-cover rounded-2xl shadow-2xl"
            style={{boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.2)'}}
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent pr-4">
                {book.title}
              </h2>
              <button 
                onClick={onClose} 
                className="text-teal-400 hover:text-teal-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {book.author && (
              <p className="text-teal-200 mb-3">Par {book.author}</p>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="text-teal-200 text-sm mb-2 block font-semibold">Statut</label>
                <select
                  value={book.status}
                  onChange={(e) => onUpdate(book.id, { status: e.target.value })}
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
                  value={book.episode}
                  onChange={(e) => onUpdate(book.id, { episode: e.target.value })}
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
                  value={book.rating}
                  onChange={(e) => onUpdate(book.id, { rating: parseInt(e.target.value) || 0 })}
                  className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                  }}
                />
              </div>

              {book.genre && (
                <div>
                  <label className="text-teal-200 text-sm mb-1 block font-semibold">Genre</label>
                  <p className="text-white">{book.genre}</p>
                </div>
              )}

              {book.site && (
                <div>
                  <label className="text-teal-200 text-sm mb-1 block font-semibold">Site</label>
                  <a 
                    href={book.site} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-300 hover:text-emerald-200 underline"
                  >
                    {book.site}
                  </a>
                </div>
              )}
              
              <button
                onClick={handleDelete}
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
  );
}