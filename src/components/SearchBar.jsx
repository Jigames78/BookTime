import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="relative mb-4">
      <Search 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" 
        style={{filter: 'drop-shadow(0 0 4px rgba(45, 212, 191, 0.6))'}} 
      />
      <input
        type="text"
        placeholder="Rechercher un titre ou un auteur..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full backdrop-blur-xl border border-teal-500/30 rounded-xl pl-12 pr-4 py-4 text-white placeholder-teal-300/50 focus:outline-none transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(13, 46, 40, 0.8) 100%)',
          boxShadow: '0 4px 20px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)'
        }}
      />
    </div>
  );
}