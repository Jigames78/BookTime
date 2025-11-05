import React from 'react';

export default function Stats({ stats }) {
  const statsData = [
    { 
      label: 'Total', 
      value: stats.total, 
      gradient: 'from-teal-500/20 to-emerald-500/20', 
      border: 'border-teal-400/30', 
      text: 'text-teal-300', 
      glow: 'rgba(45, 212, 191, 0.2)' 
    },
    { 
      label: 'Terminés', 
      value: stats.finished, 
      gradient: 'from-emerald-500/20 to-green-500/20', 
      border: 'border-emerald-400/30', 
      text: 'text-emerald-300', 
      glow: 'rgba(16, 185, 129, 0.2)' 
    },
    { 
      label: 'En cours', 
      value: stats.reading, 
      gradient: 'from-cyan-500/20 to-blue-500/20', 
      border: 'border-cyan-400/30', 
      text: 'text-cyan-300', 
      glow: 'rgba(34, 211, 238, 0.2)' 
    },
    { 
      label: 'Arrêtés', 
      value: stats.stopped, 
      gradient: 'from-gray-500/20 to-slate-500/20', 
      border: 'border-gray-400/30', 
      text: 'text-gray-300', 
      glow: 'rgba(148, 163, 184, 0.2)' 
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, i) => (
        <div 
          key={i} 
          className={`backdrop-blur-xl rounded-2xl p-6 border ${stat.border} bg-gradient-to-br ${stat.gradient} transition-all hover:scale-105`} 
          style={{
            boxShadow: `0 8px 32px ${stat.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`
          }}
        >
          <div className={`${stat.text} text-sm mb-2 font-semibold uppercase tracking-wide`}>
            {stat.label}
          </div>
          <div 
            className="text-5xl font-bold text-white" 
            style={{textShadow: `0 0 20px ${stat.glow}`}}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}