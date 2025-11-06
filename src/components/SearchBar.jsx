import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Rechercher par titre ou auteur..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full border border-gray-700 rounded-xl pl-12 pr-4 py-4 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
      />
    </div>
  );
}