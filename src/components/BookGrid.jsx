import React from 'react';
import { Book } from 'lucide-react';
import BookCard from './BookCard';

export default function BookGrid({ books, onBookClick }) {
  if (books.length === 0) {
    return (
      <div className="text-center py-24">
        <Book className="w-24 h-24 mx-auto mb-6 text-gray-600 opacity-30" />
        <p className="text-white text-xl font-semibold mb-2">Aucune lecture trouvée</p>
        <p className="text-gray-400">Utilisez les boutons Import ou Ajouter pour commencer !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {books.map(book => (
        <BookCard key={book.id} book={book} onClick={() => onBookClick(book)} />
      ))}
    </div>
  );
}