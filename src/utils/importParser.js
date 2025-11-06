import { getCoverUrlSync, updateCoverAsync } from './imageGenerator';

export const parseImportText = (importText, importStatus) => {
  const lines = importText.split('\n');
  const newBooks = [];
  
  lines.forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    line = line.replace(/[📕❤💙💚💛💜💫♥♈♑⛎📯♌♏♎🌍🌀]+/g, '').trim();
    
    let title = '';
    let episode = '';
    
    const epMatch = line.match(/^(.+?)\s+ep\s+(.+)$/i);
    if (epMatch) {
      title = epMatch[1].trim();
      episode = epMatch[2].trim();
    } else {
      title = line.trim();
    }
    
    if (title) {
      const book = {
        id: Date.now() + Math.random(),
        title,
        episode,
        site: '',
        status: importStatus,
        cover: getCoverUrlSync(title), // Image temporaire
        rating: 0,
        author: '',
        genre: ''
      };
      
      // Chercher la vraie couverture en arrière-plan
      updateCoverAsync(title).then(realCover => {
        book.cover = realCover;
      });
      
      newBooks.push(book);
    }
  });
  
  return newBooks;
};