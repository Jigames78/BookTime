import React from 'react';

export default function FilterTabs({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'all', label: 'Tous', color: '#6b7280' },
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
            activeTab === tab.key ? 'scale-105 text-white' : 'opacity-60 hover:opacity-100 bg-gray-800/50 border border-gray-700 text-gray-400'
          }`}
          style={activeTab === tab.key ? {
            background: `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}dd 100%)`,
            boxShadow: `0 0 30px ${tab.color}80`
          } : {}}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}