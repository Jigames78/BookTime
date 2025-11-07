import React from 'react';
import { Book, Upload, Plus, Database, RotateCcw } from 'lucide-react'; // ← NOUVEAU: RotateCcw

export default function Header({ onImportClick, onAddClick, onUndoClick }) { // ← NOUVEAU: onUndoClick
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b bg-gray-900/80 border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-9 h-9 text-teal-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">BookTime</h1>
              <p className="text-xs text-teal-400 flex items-center gap-1.5">
                <Database className="w-3 h-3" />
                <span>Supabase Database</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {/* ← NOUVEAU BOUTON */}
            <button
              onClick={onUndoClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 transition-all"
              style={{boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)'}}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">Annuler</span>
            </button>
            
            <button
              onClick={onImportClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all"
              style={{boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'}}
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all"
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