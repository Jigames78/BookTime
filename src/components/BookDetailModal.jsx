import React, { useState } from 'react';
import { X, Trash2, Search } from 'lucide-react'; // ← RETIRER RefreshCw
import { getCoverUrl } from '../utils/imageGenerator';

export default function BookDetailModal({ book, onClose, onUpdate, onDelete }) {
  const [editedBook, setEditedBook] = useState(book);
  const [imageUrl, setImageUrl] = useState(book.cover);
  const [searchingCover, setSearchingCover] = useState(false);

  const handleSave = () => {
    onUpdate(book.id, { ...editedBook, cover: imageUrl });
    onClose();
  };

  const handleSearchRealCover = async () => {
    setSearchingCover(true);
    const realCover = await getCoverUrl(editedBook.title);
    setImageUrl(realCover);
    setSearchingCover(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-black/80" onClick={onClose}>
      <div 
        className="rounded-3xl p-6 max-w-4xl w-full border border-gray-700 bg-gray-800/95 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Colonne image */}
          <div className="flex-shrink-0 lg:w-64">
            <img
              src={imageUrl}
              alt={editedBook.title}
              className="w-full lg:w-64 h-96 object-cover rounded-2xl shadow-2xl border border-gray-700"
            />
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL de l'image"
              className="w-full mt-3 border border-gray-700 rounded-lg px-3 py-2 text-xs bg-gray-900/50 text-white placeholder-gray-500"
            />
            <button
              onClick={handleSearchRealCover}
              disabled={searchingCover}
              className="w-full mt-2 flex items-center justify-center gap-2 border border-teal-600 rounded-lg px-3 py-2 text-xs bg-teal-900/30 text-teal-400 hover:text-teal-300 hover:bg-teal-900/50 hover:border-teal-500 transition-all disabled:opacity-50"
            >
              {searchingCover ? (
                <>
                  <Search className="w-3.5 h-3.5 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  Chercher vraie couverture
                </>
              )}
            </button>
            {/* ← BOUTON "Image aléatoire" SUPPRIMÉ */}
          </div>
          
          {/* Colonne informations */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 pr-4">
                <label className="text-gray-400 text-xs mb-2 block">Titre</label>
                <input
                  type="text"
                  value={editedBook.title}
                  onChange={(e) => setEditedBook({...editedBook, title: e.target.value})}
                  className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-700 pb-2 focus:outline-none focus:border-teal-500 text-white"
                />
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white flex-shrink-0">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Auteur</label>
                <input
                  type="text"
                  value={editedBook.author}
                  onChange={(e) => setEditedBook({...editedBook, author: e.target.value})}
                  className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Statut</label>
                  <select
                    value={editedBook.status}
                    onChange={(e) => setEditedBook({...editedBook, status: e.target.value})}
                    className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white"
                  >
                    <option value="reading">En cours</option>
                    <option value="finished">Terminé</option>
                    <option value="stopped">Arrêté</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Note (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editedBook.rating}
                    onChange={(e) => setEditedBook({...editedBook, rating: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Épisode / Chapitre</label>
                <input
                  type="text"
                  value={editedBook.episode}
                  onChange={(e) => setEditedBook({...editedBook, episode: e.target.value})}
                  className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white"
                  placeholder="ex: 150, 3x12, Chapitre 45..."
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Genre</label>
                <input
                  type="text"
                  value={editedBook.genre}
                  onChange={(e) => setEditedBook({...editedBook, genre: e.target.value})}
                  className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white"
                  placeholder="ex: Action, Romance, Fantasy..."
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Site web</label>
                <input
                  type="text"
                  value={editedBook.site}
                  onChange={(e) => setEditedBook({...editedBook, site: e.target.value})}
                  className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white"
                  placeholder="ex: webtoons.com, asurascans.com..."
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