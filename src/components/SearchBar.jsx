import React from 'react';
import { Search } from 'lucide-react';
import { themes } from '../utils/themes';

export default function SearchBar({ searchTerm, onSearchChange, theme }) {
  const currentTheme = themes[theme];

  return (
    <div className="relative mb-4">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`} />
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full border rounded-xl pl-12 pr-4 py-4 ${currentTheme.text}`}
        style={{
          background: currentTheme.inputBg,
          borderColor: currentTheme.border
        }}
      />
    </div>
  );
}