import React from 'react';
import { Book, Upload, Plus } from 'lucide-react';

export default function Header({ onImportClick, onAddClick }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b bg-gray-900/80 border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-9 h-9 text-teal-400" />
            <h1 className="text-3xl font-bold text-white">BookTime</h1>
          </div>
          <div className="flex gap-3">
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