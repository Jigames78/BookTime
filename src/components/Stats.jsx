import React from 'react';

export default function Stats({ stats }) {
  const statsData = [
    { label: 'Total', value: stats.total, color: '#6b7280' },
    { label: 'Terminés', value: stats.finished, color: '#22c55e' },
    { label: 'En cours', value: stats.reading, color: '#3b82f6' },
    { label: 'Arrêtés', value: stats.stopped, color: '#ef4444' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, i) => (
        <div 
          key={i} 
          className="relative backdrop-blur-xl rounded-2xl p-6 border border-gray-700 bg-gray-800/50 transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="text-gray-400 text-sm mb-2 font-semibold uppercase tracking-wider">
            {stat.label}
          </div>
          <div 
            className="text-5xl font-bold relative z-10"
            style={{ 
              color: stat.color,
              filter: 'drop-shadow(0 0 10px currentColor)'
            }}
          >
            {stat.value}
          </div>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
            style={{ 
              background: stat.color,
              boxShadow: `0 0 10px ${stat.color}`
            }}
          />
        </div>
      ))}
    </div>
  );
}