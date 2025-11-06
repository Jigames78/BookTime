import React, { useState } from 'react';
import { X } from 'lucide-react';
import { themes } from '../utils/themes';
import { parseImportText } from '../utils/importParser';

export default function ImportModal({ onClose, onImport, theme }) {
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState('finished');
  const currentTheme = themes[theme];

  const handleImport = () => {
    const newBooks = parseImportText(importText, importStatus);
    if (newBooks.length > 0) {
      onImport(newBooks);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg"
      style={{ background: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}
    >
      <div 
        className="rounded-3xl p-6 max-w-2xl w-full border"
        style={{
          background: currentTheme.cardBg,
          borderColor: currentTheme.border,
          boxShadow: theme === 'dark' ? '0 0 60px rgba(0, 0, 0, 0.8)' : '0 0 60px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Importer vos lectures</h2>
          <button onClick={onClose} className={currentTheme.textSecondary + ' hover:opacity-70'}>
            <X className="w-7 h-7" />
          </button>
        </div>
        
        <div className="space-y-5">
          <select
            value={importStatus}
            onChange={(e) => setImportStatus(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 ${currentTheme.text}`}
            style={{
              background: currentTheme.inputBg,
              borderColor: currentTheme.border
            }}
          >
            <option value="finished">Terminés</option>
            <option value="reading">En cours</option>
            <option value="stopped">Arrêtés</option>
          </select>

          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Solo Leveling ep 179 End&#10;Nano Machine ep 212&#10;..."
            rows={15}
            className={`w-full border rounded-xl px-4 py-3 font-mono text-sm ${currentTheme.text}`}
            style={{
              background: currentTheme.inputBg,
              borderColor: currentTheme.border
            }}
          />
          
          <button
            onClick={handleImport}
            disabled={!importText.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 disabled:opacity-50"
            style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' }}
          >
            Importer
          </button>
        </div>
      </div>
    </div>
  );
}