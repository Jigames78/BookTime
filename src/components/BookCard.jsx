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
      case 'finished': return 'bg-gradient-to-br from-emerald-400 to-teal-500';
      case 'reading': return 'bg-gradient-to-br from-cyan-400 to-blue-500';
      case 'stopped': return 'bg-gradient-to-br from-gray-400 to-gray-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div onClick={onClick} className="group cursor-pointer">
      <div 
        className="relative overflow-hidden rounded-2xl transition-all duration-500 group-hover:scale-110" 
        style={{
          boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(45, 212, 191, 0.2)'
        }}
      >
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-72 object-cover"
        />
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{
            background: 'linear-gradient(to top, rgba(10, 31, 28, 0.95) 0%, rgba(13, 46, 40, 0.7) 50%, transparent 100%)'
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white font-bold text-sm mb-1 line-clamp-2 drop-shadow-lg">
              {book.title}
            </div>
            {book.author && (
              <div className="text-teal-200 text-xs mb-1 drop-shadow">
                {book.author}
              </div>
            )}
            {book.episode && (
              <div className="text-emerald-300 text-xs font-semibold drop-shadow">
                Ép {book.episode}
              </div>
            )}
          </div>
        </div>
        <div 
          className={`absolute top-3 left-3 ${getStatusColor(book.status)} rounded-full p-2 shadow-xl`} 
          style={{
            boxShadow: '0 4px 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
          }}
        >
          {getStatusIcon(book.status)}
        </div>
        {book.rating > 0 && (
          <div 
            className="absolute top-3 right-3 rounded-full px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-lg" 
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.95) 0%, rgba(245, 158, 11, 0.95) 100%)',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
            }}
          >
            <Star className="w-3.5 h-3.5 fill-white text-white drop-shadow" />
            <span className="text-white text-xs font-bold drop-shadow">{book.rating}</span>
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <div className="text-teal-100 font-semibold text-sm line-clamp-1 drop-shadow">
          {book.title}
        </div>
        {book.episode && (
          <div className="text-teal-400/70 text-xs mt-0.5">
            Épisode {book.episode}
          </div>
        )}
      </div>
    </div>
  );
}