import React from 'react';
import { Book, Upload, Plus, Palette } from 'lucide-react';
import { themes } from '../utils/themes';

export default function Header({ theme, onToggleTheme, onImportClick, onAddClick }) {
  const currentTheme = themes[theme];

  return (
    <header 
      className="sticky top-0 z-40 backdrop-blur-xl border-b"
      style={{
        background: theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: currentTheme.border
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className={`w-9 h-9 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`} />
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
              BookTime
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all border"
              style={{
                background: currentTheme.inputBg,
                borderColor: currentTheme.border,
                color: theme === 'dark' ? '#9ca3af' : '#4b5563'
              }}
            >
              <Palette className="w-5 h-5" />
              <span className="hidden sm:inline">{themes[theme].name}</span>
            </button>
            <button
              onClick={onImportClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600"
              style={{boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'}}
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600"
              style={{boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'}}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}