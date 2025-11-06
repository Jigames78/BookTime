export const themes = {
  dark: {
    name: 'Noir',
    bg: 'from-black via-gray-900 to-black',
    cardBg: 'rgba(17, 24, 39, 0.8)',
    border: 'rgba(75, 85, 99, 0.3)',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    inputBg: 'rgba(31, 41, 55, 0.5)',
    stats: {
      total: { color: '#6b7280', shadow: '0 0 30px rgba(107, 114, 128, 0.6)' },
      finished: { color: '#22c55e', shadow: '0 0 30px rgba(34, 197, 94, 0.6)' },
      reading: { color: '#3b82f6', shadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
      stopped: { color: '#ef4444', shadow: '0 0 30px rgba(239, 68, 68, 0.6)' }
    }
  },
  light: {
    name: 'Blanc',
    bg: 'from-gray-50 via-white to-gray-50',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(229, 231, 235, 0.8)',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    inputBg: 'rgba(249, 250, 251, 0.8)',
    stats: {
      total: { color: '#4b5563', shadow: '0 0 30px rgba(75, 85, 99, 0.3)' },
      finished: { color: '#16a34a', shadow: '0 0 30px rgba(22, 163, 74, 0.4)' },
      reading: { color: '#2563eb', shadow: '0 0 30px rgba(37, 99, 235, 0.4)' },
      stopped: { color: '#dc2626', shadow: '0 0 30px rgba(220, 38, 38, 0.4)' }
    }
  }
};