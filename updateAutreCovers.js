import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import fs from 'fs';

// 🔐 Configuration
const SUPABASE_URL = 'https://elqoienhnbfjucmuoxnq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscW9pZW5obmJmanVjbXVveG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTg2NzAsImV4cCI6MjA3ODA3NDY3MH0.m71Dsd0sDEfjv590gVsEF7aefJE8G_07t2Cog9VmIAk';
const ANILIST_API = 'https://graphql.anilist.co';
const PROGRESS_FILE = 'autre-covers-progress.json';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🎨 Couleurs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}\n`),
};

// 📊 Sauvegarde progression
function saveProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return { processed: [], updated: [], failed: [] };
  }
}

// 🧹 Nettoyer le titre pour la recherche
function cleanTitle(title) {
  return title
    .replace(/\s*ep\s*\d+.*$/i, '')
    .replace(/\s*chapter\s*\d+.*$/i, '')
    .replace(/\s*ch\s*\d+.*$/i, '')
    .replace(/\s*end\s*$/i, '')
    .replace(/\s*\(.*\)\s*$/i, '')
    .trim();
}

// 🔍 Recherche sur AniList (meilleur pour manhwas/BL)
async function searchAnilist(title, retryCount = 0) {
  const cleanedTitle = cleanTitle(title);

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
        }
        format
        countryOfOrigin
        genres
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
        variables: { search: cleanedTitle }
      })
    });

    if (response.status === 429 && retryCount < 3) {
      const waitTime = (retryCount + 1) * 10000;
      log.warning(`Rate limit, pause ${waitTime/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return searchAnilist(title, retryCount + 1);
    }

    if (!response.ok) return null;

    const data = await response.json();

    if (data.data?.Media?.coverImage) {
      const cover = data.data.Media.coverImage.extraLarge || 
                    data.data.Media.coverImage.large;
      
      if (cover) {
        const matchedTitle = data.data.Media.title.english || 
                           data.data.Media.title.romaji;
        return {
          cover,
          matchedTitle,
          source: 'AniList',
          format: data.data.Media.format,
          country: data.data.Media.countryOfOrigin
        };
      }
    }
  } catch (error) {
    // Silencieux
  }
  return null;
}

// 🔍 Recherche sur MyAnimeList via Jikan API
async function searchMyAnimeList(title) {
  const cleanedTitle = cleanTitle(title);
  
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(cleanedTitle)}&limit=1`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.data && data.data[0]?.images?.jpg?.large_image_url) {
      return {
        cover: data.data[0].images.jpg.large_image_url,
        matchedTitle: data.data[0].title,
        source: 'MyAnimeList'
      };
    }
  } catch (error) {
    // Silencieux
  }
  return null;
}

// 🔍 Recherche Google Books (pour light novels)
async function searchGoogleBooks(title) {
  const cleanedTitle = cleanTitle(title);

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanedTitle)}&maxResults=1`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.items && data.items[0]?.volumeInfo?.imageLinks) {
      const imageLinks = data.items[0].volumeInfo.imageLinks;
      const url = imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
      return {
        cover: url ? url.replace('http://', 'https://') : null,
        matchedTitle: data.items[0].volumeInfo.title,
        source: 'Google Books'
      };
    }
  } catch (error) {
    // Silencieux
  }
  return null;
}

// 🔍 Recherche multi-sources
async function findBestCover(title) {
  console.log(`   🔎 Recherche: "${cleanTitle(title)}"`);

  // 1. Essayer AniList (meilleur pour manhwas coréens/BL)
  const anilistResult = await searchAnilist(title);
  if (anilistResult?.cover) {
    console.log(`   ${colors.magenta}→ AniList${colors.reset}: ${anilistResult.matchedTitle}`);
    return anilistResult;
  }

  // 2. Essayer MyAnimeList
  const malResult = await searchMyAnimeList(title);
  if (malResult?.cover) {
    console.log(`   ${colors.blue}→ MyAnimeList${colors.reset}: ${malResult.matchedTitle}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit MAL
    return malResult;
  }

  // 3. Google Books en dernier recours
  const googleResult = await searchGoogleBooks(title);
  if (googleResult?.cover) {
    console.log(`   ${colors.cyan}→ Google Books${colors.reset}: ${googleResult.matchedTitle}`);
    return googleResult;
  }

  return null;
}

// 🚀 Main
async function main() {
  log.title('🎭 MISE À JOUR COUVERTURES STATUT "AUTRE"');
  log.info('Recherche optimisée pour manhwas BL (Manytoon, scans...)');

  const stats = {
    total: 0,
    processed: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    sources: {
      anilist: 0,
      mal: 0,
      google: 0
    }
  };

  const progress = loadProgress();

  try {
    // 📥 Charger uniquement les livres "autre"
    log.info('Chargement des livres avec statut "autre"...');
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .eq('status', 'autre')
      .order('title', { ascending: true });

    if (error) {
      log.error(`Erreur: ${error.message}`);
      process.exit(1);
    }

    stats.total = books.length;
    log.success(`${stats.total} livres "autre" trouvés`);

    if (stats.total === 0) {
      log.warning('Aucun livre avec le statut "autre" dans la base');
      process.exit(0);
    }

    log.title('🔄 TRAITEMENT');

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      
      console.log(`\n${colors.cyan}[${i + 1}/${stats.total}]${colors.reset} ${colors.bright}${book.title}${colors.reset}`);
      console.log(`   Couverture actuelle: ${book.cover.substring(0, 60)}...`);

      // Vérifier si déjà traité
      if (progress.updated.includes(book.id)) {
        log.info('Déjà mis à jour précédemment');
        stats.skipped++;
        continue;
      }

      stats.processed++;

      // Rechercher nouvelle couverture
      const result = await findBestCover(book.title);

      if (result?.cover && result.cover !== book.cover) {
        // Mettre à jour dans Supabase
        const { error: updateError } = await supabase
          .from('books')
          .update({ cover: result.cover })
          .eq('id', book.id);

        if (updateError) {
          log.error(`Échec MAJ: ${updateError.message}`);
          stats.failed++;
          progress.failed.push(book.id);
        } else {
          log.success(`✨ Couverture mise à jour depuis ${result.source}`);
          stats.updated++;
          
          // Compter la source
          if (result.source === 'AniList') stats.sources.anilist++;
          else if (result.source === 'MyAnimeList') stats.sources.mal++;
          else if (result.source === 'Google Books') stats.sources.google++;
          
          progress.updated.push(book.id);
          progress.processed.push(book.id);
        }
      } else if (result?.cover === book.cover) {
        log.info('Couverture déjà à jour');
        stats.skipped++;
        progress.processed.push(book.id);
      } else {
        log.warning('❌ Aucune couverture trouvée');
        stats.failed++;
        progress.failed.push(book.id);
      }

      saveProgress(progress);
      
      // Pause pour éviter rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // 📊 Statistiques finales
    console.log('\n');
    log.title('📊 RÉSUMÉ');
    console.log(`Total traité        : ${colors.bright}${stats.processed}${colors.reset}`);
    console.log(`${colors.green}✅ Mises à jour      : ${stats.updated}${colors.reset}`);
    console.log(`   ${colors.magenta}→ AniList         : ${stats.sources.anilist}${colors.reset}`);
    console.log(`   ${colors.blue}→ MyAnimeList     : ${stats.sources.mal}${colors.reset}`);
    console.log(`   ${colors.cyan}→ Google Books    : ${stats.sources.google}${colors.reset}`);
    console.log(`${colors.yellow}⊙ Déjà à jour        : ${stats.skipped}${colors.reset}`);
    console.log(`${colors.red}❌ Échecs            : ${stats.failed}${colors.reset}`);
    
    if (stats.processed > 0) {
      const successRate = Math.round((stats.updated / stats.processed) * 100);
      console.log(`\nTaux de succès      : ${colors.bright}${successRate}%${colors.reset}`);
    }

    if (stats.failed > 0) {
      console.log(`\n${colors.yellow}💡 Conseil:${colors.reset} Les titres non trouvés peuvent nécessiter une recherche manuelle`);
      console.log(`Les IDs échoués sont sauvegardés dans ${PROGRESS_FILE}`);
    }

    console.log('\n');

  } catch (error) {
    log.error(`Erreur fatale: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();