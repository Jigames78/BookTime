import React from 'react';
import { themes } from '../utils/themes';

export default function FilterTabs({ activeTab, onTabChange, theme }) {
  const currentTheme = themes[theme];

  const tabs = [
    { key: 'all', label: 'Tous', color: theme === 'dark' ? '#6b7280' : '#4b5563' },
    { key: 'reading', label: 'En cours', color: '#3b82f6' },
    { key: 'finished', label: 'Terminés', color: '#22c55e' },
    { key: 'stopped', label: 'Arrêtés', color: '#ef4444' }
  ];

  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === tab.key ? 'scale-105' : 'opacity-60 hover:opacity-100'
          }`}
          style={activeTab === tab.key ? {
            background: `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}dd 100%)`,
            boxShadow: `0 0 30px ${tab.color}80`,
            color: 'white'
          } : {
            background: currentTheme.inputBg,
            border: `1px solid ${currentTheme.border}`,
            color: currentTheme.textSecondary
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}