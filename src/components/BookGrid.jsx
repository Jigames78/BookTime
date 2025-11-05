import React from 'react';
import { Book, Sparkles } from 'lucide-react';
import BookCard from './BookCard';

export default function BookGrid({ books, onBookClick }) {
  if (books.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="relative inline-block">
          <Book className="w-24 h-24 text-teal-500/30 mx-auto mb-6" />
          <Sparkles className="w-8 h-8 text-emerald-400 absolute top-0 right-0 animate-pulse" />
        </div>
        <p className="text-teal-200 text-xl font-semibold mb-2">Aucune lecture trouvée</p>
        <p className="text-teal-400/60">Utilisez le bouton Import pour ajouter vos listes !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {books.map(book => (
        <BookCard 
          key={book.id} 
          book={book} 
          onClick={() => onBookClick(book)} 
        />
      ))}
    </div>
  );
}