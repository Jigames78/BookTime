import React from 'react';

export default function FilterTabs({ activeTab, onTabChange, hasBooks, onClearAll }) {
  const tabs = [
    { key: 'all', label: 'Tous' },
    { key: 'reading', label: 'En cours' },
    { key: 'finished', label: 'Terminés' },
    { key: 'stopped', label: 'Arrêtés' }
  ];

  return (
    <div className="flex gap-3 flex-wrap items-center">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === tab.key ? 'scale-105 text-white' : 'scale-100 opacity-70 hover:opacity-100'
          }`}
          style={activeTab === tab.key ? {
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.2)'
          } : {
            background: 'rgba(20, 184, 166, 0.1)',
            border: '1px solid rgba(20, 184, 166, 0.3)',
            color: 'rgb(153, 246, 228)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {tab.label}
        </button>
      ))}
      {hasBooks && (
        <button
          onClick={onClearAll}
          className="ml-auto px-4 py-2.5 rounded-xl text-sm transition-all backdrop-blur-lg hover:scale-105"
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: 'rgb(252, 165, 165)'
          }}
        >
          Tout effacer
        </button>
      )}
    </div>
  );
}