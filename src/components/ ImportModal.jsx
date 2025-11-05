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
      onClose();
      alert(`${newBooks.length} lecture(s) importée(s) avec succès !`);
    } else {
      alert('Aucune lecture valide trouvée dans le texte.');
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
        className="rounded-3xl p-6 max-w-2xl w-full border max-h-[90vh] overflow-y-auto" 
        style={{
          background: 'linear-gradient(135deg, rgba(13, 46, 40, 0.98) 0%, rgba(10, 31, 28, 0.98) 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          borderColor: 'rgba(45, 212, 191, 0.3)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
            Importer vos lectures
          </h2>
          <button 
            onClick={onClose} 
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="text-teal-200 text-sm mb-2 block font-semibold uppercase tracking-wide">
              Statut des lectures
            </label>
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
            <div 
              className="text-teal-300/80 text-xs mb-3 p-4 rounded-xl backdrop-blur-lg" 
              style={{
                background: 'rgba(6, 78, 59, 0.3)',
                border: '1px solid rgba(45, 212, 191, 0.2)'
              }}
            >
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
              onClick={handleImport}
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
  );
}