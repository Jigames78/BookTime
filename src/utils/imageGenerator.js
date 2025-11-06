const ANILIST_API = 'https://graphql.anilist.co';

// Recherche sur Anilist (manhwas, mangas, webtoons)
export const searchAnilistCover = async (title) => {
  const query = `
    query ($search: String) {
      Media(search: $search, type: MANGA, sort: SEARCH_MATCH) {
        coverImage {
          extraLarge
          large
        }
      }
    }
  `;

  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { search: title }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data?.Media?.coverImage) {
      return data.data.Media.coverImage.extraLarge || data.data.Media.coverImage.large;
    }
  } catch (error) {
    console.log('Anilist: couverture non trouvée pour', title, error.message);
  }
  return null;
};

// Recherche sur Google Books
export const searchGoogleBooksCover = async (title) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items[0]?.volumeInfo?.imageLinks) {
      const imageLinks = data.items[0].volumeInfo.imageLinks;
      // Remplacer http par https pour éviter les erreurs
      const url = imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
      return url ? url.replace('http://', 'https://') : null;
    }
  } catch (error) {
    console.log('Google Books: couverture non trouvée pour', title, error.message);
  }
  return null;
};

// Génération de fallback (image par défaut si rien trouvé)
const getFallbackCover = (title) => {
  const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://picsum.photos/seed/${seed}/400/600`;
};

// Fonction principale qui essaie toutes les sources
export const getCoverUrl = async (title) => {
  // Essayer d'abord Anilist (meilleur pour manhwas/webtoons)
  let cover = await searchAnilistCover(title);
  if (cover) {
    console.log('✅ Couverture trouvée sur Anilist:', title);
    return cover;
  }

  // Puis Google Books
  cover = await searchGoogleBooksCover(title);
  if (cover) {
    console.log('✅ Couverture trouvée sur Google Books:', title);
    return cover;
  }

  // Fallback : image générée
  console.log('⚠️ Utilisation image par défaut pour:', title);
  return getFallbackCover(title);
};

// Version synchrone pour l'import rapide (utilise fallback immédiatement)
export const getCoverUrlSync = (title) => {
  return getFallbackCover(title);
};

// Fonction pour mettre à jour une couverture après coup
export const updateCoverAsync = async (title) => {
  return await getCoverUrl(title);
};