import React from 'react';
import { Book, Upload, Plus, Sparkles } from 'lucide-react';

export default function Header({ onImportClick, onAddClick }) {
  return (
    <header className="relative backdrop-blur-xl border-b border-teal-500/20 sticky top-0 z-40" style={{
      background: 'linear-gradient(180deg, rgba(13, 46, 40, 0.95) 0%, rgba(10, 31, 28, 0.9) 100%)',
      boxShadow: '0 8px 32px 0 rgba(20, 184, 166, 0.1)'
    }}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Book className="w-9 h-9 text-teal-400" style={{filter: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.6))'}} />
              <Sparkles className="w-4 h-4 text-emerald-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent" style={{
              textShadow: '0 0 20px rgba(45, 212, 191, 0.3)'
            }}>BookTime</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onImportClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all relative group overflow-hidden text-white"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                border: '1px solid rgba(45, 212, 191, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Upload className="w-5 h-5 relative z-10" />
              <span className="hidden sm:inline relative z-10">Import</span>
            </button>
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all relative group overflow-hidden text-white"
              style={{
                background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
                boxShadow: '0 4px 15px rgba(45, 212, 191, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                border: '1px solid rgba(94, 234, 212, 0.4)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Plus className="w-5 h-5 relative z-10" />
              <span className="hidden sm:inline relative z-10">Ajouter</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}