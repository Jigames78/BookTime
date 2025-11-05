import { getCoverUrl } from './imageGenerator';

export const parseImportText = (importText, importStatus) => {
  const lines = importText.split('\n');
  const newBooks = [];
  
  lines.forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#') || line.startsWith('-   ')) {
      return;
    }
    
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
      newBooks.push({
        id: Date.now() + Math.random(),
        title,
        episode,
        site: '',
        status: importStatus,
        cover: getCoverUrl(title),
        rating: 0,
        author: '',
        genre: ''
      });
    }
  });
  
  return newBooks;
};