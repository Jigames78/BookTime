export const parseImportText = (importText, importStatus) => {
  const lines = importText.split('\n');
  const newBooks = [];
  
  lines.forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    // Supprimer les emojis
    line = line.replace(/[📕❤💙💚💛💜💫♥♈♑⛎📯♌♏♎🌍🌀]+/g, '').trim();
    
    let title = '';
    let episode = '';
    
    // Extraire le titre et l'épisode
    const epMatch = line.match(/^(.+?)\s+ep\s+(.+)$/i);
    if (epMatch) {
      title = epMatch[1].trim();
      episode = epMatch[2].trim();
    } else {
      title = line.trim();
    }
    
    if (title) {
      const book = {
        title,
        episode: episode || '',
        site: '',
        status: importStatus,
        cover: '', // Sera rempli par le hook
        rating: 0,
        author: '',
        genre: ''
      };
      
      newBooks.push(book);
    }
  });
  
  return newBooks;
};