import React from 'react';
import { Check, Clock, XCircle, Star } from 'lucide-react';

export default function BookCard({ book, onClick }) {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'finished': return <Check className="w-4 h-4 text-white" />;
      case 'reading': return <Clock className="w-4 h-4 text-white" />;
      case 'stopped': return <XCircle className="w-4 h-4 text-white" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'finished': return { bg: 'bg-gradient-to-br from-emerald-500 to-green-600', shadow: '0 0 20px rgba(16, 185, 129, 0.8)' };
      case 'reading': return { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', shadow: '0 0 20px rgba(59, 130, 246, 0.8)' };
      case 'stopped': return { bg: 'bg-gradient-to-br from-red-500 to-rose-600', shadow: '0 0 20px rgba(239, 68, 68, 0.8)' };
      default: return { bg: 'bg-gray-500', shadow: 'none' };
    }
  };

  const statusStyle = getStatusColor(book.status);

  return (
    <div onClick={onClick} className="group cursor-pointer">
      <div 
        className="relative overflow-hidden rounded-2xl transition-all duration-500 group-hover:scale-105 group-hover:z-10"
        style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)' }}
      >
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white font-bold text-sm mb-1 line-clamp-2 drop-shadow-lg">
              {book.title}
            </div>
            {book.author && (
              <div className="text-gray-300 text-xs mb-1">{book.author}</div>
            )}
            {book.episode && (
              <div className="text-purple-300 text-xs font-semibold">Ép {book.episode}</div>
            )}
          </div>
        </div>
        <div className={`absolute top-3 left-3 ${statusStyle.bg} rounded-full p-2`} style={{ boxShadow: statusStyle.shadow }}>
          {getStatusIcon(book.status)}
        </div>
        {book.rating > 0 && (
          <div className="absolute top-3 right-3 rounded-full px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-lg bg-gradient-to-r from-amber-500 to-orange-500"
            style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.8)' }}>
            <Star className="w-3.5 h-3.5 fill-white text-white" />
            <span className="text-white text-xs font-bold">{book.rating}</span>
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <div className="text-white font-semibold text-sm line-clamp-1">{book.title}</div>
        {book.episode && <div className="text-gray-400 text-xs mt-0.5">Épisode {book.episode}</div>}
      </div>
    </div>
  );
}