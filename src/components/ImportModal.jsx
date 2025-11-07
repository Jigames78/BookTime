import React, { useState } from 'react';
import { X } from 'lucide-react';
import { parseImportText } from '../utils/importParser';

export default function ImportModal({ onClose, onImport }) {
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState('finished');

  const handleImport = () => {
    const newBooks = parseImportText(importText, importStatus);
    if (newBooks.length > 0) {
      onImport(newBooks);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-black/80" onClick={onClose}>
      <div className="rounded-3xl p-6 max-w-2xl w-full border border-gray-700 bg-gray-800/95" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Importer vos lectures</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-7 h-7" />
          </button>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Statut des livres à importer</label>
            <select
              value={importStatus}
              onChange={(e) => setImportStatus(e.target.value)}
              className="w-full border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/50 text-white"
            >
              <option value="finished">Terminés</option>
              <option value="reading">En cours</option>
              <option value="stopped">Arrêtés</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Liste des livres (un par ligne)</label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Solo Leveling ep 179 End&#10;Nano Machine ep 212&#10;Tower of God&#10;..."
              rows={15}
              className="w-full border border-gray-700 rounded-xl px-4 py-3 font-mono text-sm bg-gray-900/50 text-white placeholder-gray-500"
            />
          </div>

          <div className="p-4 bg-teal-900/20 border border-teal-700 rounded-xl">
            <p className="text-sm text-teal-300">
              ✨ Les couvertures seront recherchées automatiquement pour chaque livre
            </p>
          </div>
          
          <button
            onClick={handleImport}
            disabled={!importText.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-emerald-500 transition-all"
            style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
          >
            Importer ({importText.split('\n').filter(l => l.trim()).length} livres)
          </button>
        </div>
      </div>
    </div>
  );
}