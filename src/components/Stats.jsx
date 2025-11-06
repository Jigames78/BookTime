import React from 'react';
import { themes } from '../utils/themes';

export default function Stats({ stats, theme }) {
  const currentTheme = themes[theme];
  const statsData = [
    { 
      label: 'Total', 
      value: stats.total, 
      ...currentTheme.stats.total
    },
    { 
      label: 'Terminés', 
      value: stats.finished, 
      ...currentTheme.stats.finished
    },
    { 
      label: 'En cours', 
      value: stats.reading, 
      ...currentTheme.stats.reading
    },
    { 
      label: 'Arrêtés', 
      value: stats.stopped, 
      ...currentTheme.stats.stopped
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, i) => (
        <div 
          key={i} 
          className="relative backdrop-blur-xl rounded-2xl p-6 border transition-all hover:scale-105 cursor-pointer group"
          style={{
            background: currentTheme.cardBg,
            borderColor: currentTheme.border,
            boxShadow: theme === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" 
            style={{ boxShadow: stat.shadow }}
          />
          <div className={`${currentTheme.textSecondary} text-sm mb-2 font-semibold uppercase tracking-wider`}>
            {stat.label}
          </div>
          <div 
            className="text-5xl font-bold relative z-10"
            style={{ 
              color: stat.color,
              textShadow: stat.shadow,
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