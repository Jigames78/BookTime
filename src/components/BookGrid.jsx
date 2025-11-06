import React from 'react';
import { Book } from 'lucide-react';
import { themes } from '../utils/themes';
import BookCard from './BookCard';

export default function BookGrid({ books, onBookClick, theme }) {
  const currentTheme = themes[theme];

  if (books.length === 0) {
    return (
      <div className="text-center py-24">
        <Book className={`w-24 h-24 mx-auto mb-6 ${currentTheme.textSecondary} opacity-30`} />
        <p className={`${currentTheme.text} text-xl font-semibold mb-2`}>Aucune lecture trouvée</p>
        <p className={currentTheme.textSecondary}>Utilisez les boutons Import ou Ajouter pour commencer !</p>
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
          theme={theme}
        />
      ))}
    </div>
  );
}