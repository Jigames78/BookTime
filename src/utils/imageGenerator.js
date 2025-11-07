const ANILIST_API = 'https://graphql.anilist.co';

// Recherche sur Anilist (manhwas, mangas, webtoons) - VERSION AMÉLIORÉE
export const searchAnilistCover = async (title) => {
  // Nettoyer le titre pour améliorer la recherche
  let cleanTitle = title
    .replace(/\s*ep\s*\d+.*$/i, '') // Supprimer "ep XXX"
    .replace(/\s*chapter\s*\d+.*$/i, '') // Supprimer "chapter XXX"
    .replace(/\s*end\s*$/i, '') // Supprimer "End"
    .trim();

  const query = `
    query ($search: String) {
      Media(search: $search, type: MANGA, sort: SEARCH_MATCH) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          medium
        }
        format
        countryOfOrigin
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
        variables: { search: cleanTitle }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data?.Media?.coverImage) {
      const cover = data.data.Media.coverImage.extraLarge || 
                    data.data.Media.coverImage.large || 
                    data.data.Media.coverImage.medium;
      
      if (cover) {
        console.log(`✅ [AniList] Trouvé pour "${cleanTitle}":`, data.data.Media.title.romaji || data.data.Media.title.english);
        return cover;
      }
    }
  } catch (error) {
    console.log(`❌ [AniList] Erreur pour "${cleanTitle}":`, error.message);
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

// Génération de fallback avec style manga/anime
const getFallbackCover = (title) => {
  // Utiliser des images d'anime/manga par défaut de Lorem Picsum avec IDs spécifiques
  const animeImageIds = [
    237, 1084, 1025, 823, 452, 883, 1069, 
    548, 659, 485, 593, 1074, 929, 447
  ];
  
  const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = animeImageIds[seed % animeImageIds.length];
  
  // Ajouter un filtre pour donner un aspect "manga/anime"
  return `https://picsum.photos/id/${imageId}/400/600?grayscale&blur=1`;
};

// Fonction principale qui essaie toutes les sources
export const getCoverUrl = async (title) => {
  console.log(`🔍 Recherche de couverture pour: "${title}"`);
  
  // Essayer d'abord Anilist (meilleur pour manhwas/webtoons/mangas)
  let cover = await searchAnilistCover(title);
  if (cover) {
    console.log(`✅ Couverture AniList trouvée pour: ${title}`);
    return cover;
  }

  // Puis Google Books (pour les light novels)
  cover = await searchGoogleBooksCover(title);
  if (cover) {
    console.log(`✅ Couverture Google Books trouvée pour: ${title}`);
    return cover;
  }

  // Fallback : image générée avec style manga
  console.log(`⚠️ Aucune couverture trouvée, utilisation fallback pour: ${title}`);
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