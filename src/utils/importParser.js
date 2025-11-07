import { getCoverUrlSync, updateCoverAsync } from './imageGenerator';

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
        // ❌ NE PAS INCLURE d'id ici - Supabase le génère automatiquement
        title,
        episode: episode || '',
        site: '',
        status: importStatus,
        cover: getCoverUrlSync(title), // Image temporaire
        rating: 0,
        author: '',
        genre: ''
      };
      
      // Chercher la vraie couverture en arrière-plan
      // Note: Ceci ne fonctionnera plus car on n'a pas encore l'ID
      // On laisse juste l'image temporaire
      
      newBooks.push(book);
    }
  });
  
  return newBooks;
};