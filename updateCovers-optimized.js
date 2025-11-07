#!/usr/bin/env node

/**
 * 📘 Script OPTIMISÉ de mise à jour des couvertures
 * 
 * Améliorations :
 * - Recherche sur Google Books ET AniList
 * - Gestion intelligente du rate limiting
 * - Mode batch (traiter par groupe)
 * - Sauvegarde de progression
 * - Statistiques détaillées
 * 
 * Usage:
 *   node updateCovers-optimized.js [--batch 50] [--delay 3000]
 * 
 * Options:
 *   --batch N   : Traiter N livres par session (défaut: tous)
 *   --delay MS  : Délai entre requêtes en ms (défaut: 3000)
 *   --skip N    : Commencer à partir du livre N
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import fs from 'fs';

// 🔐 Configuration
const SUPABASE_URL = 'https://elqoienhnbfjucmuoxnq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscW9pZW5obmJmanVjbXVveG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTg2NzAsImV4cCI6MjA3ODA3NDY3MH0.m71Dsd0sDEfjv590gVsEF7aefJE8G_07t2Cog9VmIAk';
const ANILIST_API = 'https://graphql.anilist.co';
const PROGRESS_FILE = 'cover-update-progress.json';

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
  progress: (current, total) => {
    const percent = Math.round((current / total) * 100);
    const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));
    process.stdout.write(`\r${colors.cyan}[${bar}]${colors.reset} ${percent}% (${current}/${total})`);
  }
};

// 📊 Sauvegarde de progression
function saveProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return { processed: [], failed: [] };
  }
}

// 🔍 Recherche sur Google Books
async function searchGoogleBooks(title) {
  const cleanTitle = title
    .replace(/\s*ep\s*\d+.*$/i, '')
    .replace(/\s*chapter\s*\d+.*$/i, '')
    .replace(/\s*end\s*$/i, '')
    .trim();

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanTitle)}&maxResults=1`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.items && data.items[0]?.volumeInfo?.imageLinks) {
      const imageLinks = data.items[0].volumeInfo.imageLinks;
      const url = imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
      return url ? url.replace('http://', 'https://') : null;
    }
  } catch (error) {
    // Silencieux
  }
  return null;
}

// 🔍 Recherche sur AniList avec retry
async function searchAnilist(title, retryCount = 0) {
  const cleanTitle = title
    .replace(/\s*ep\s*\d+.*$/i, '')
    .replace(/\s*chapter\s*\d+.*$/i, '')
    .replace(/\s*end\s*$/i, '')
    .trim();

  const query = `
    query ($search: String) {
      Media(search: $search, type: MANGA, sort: SEARCH_MATCH) {
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
          medium
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
        variables: { search: cleanTitle }
      })
    });

    if (response.status === 429 && retryCount < 3) {
      const waitTime = (retryCount + 1) * 10000;
      log.warning(`Rate limit AniList, pause ${waitTime/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return searchAnilist(title, retryCount + 1);
    }

    if (!response.ok) return null;

    const data = await response.json();

    if (data.data?.Media?.coverImage) {
      const cover = data.data.Media.coverImage.extraLarge ||
                    data.data.Media.coverImage.large ||
                    data.data.Media.coverImage.medium;
      
      if (cover) {
        const matchedTitle = data.data.Media.title.romaji || data.data.Media.title.english;
        return { cover, matchedTitle };
      }
    }
  } catch (error) {
    // Silencieux
  }
  return null;
}

// 🔍 Recherche multi-sources
async function findBestCover(title) {
  // Essayer d'abord Google Books (plus rapide, pas de rate limit)
  const googleCover = await searchGoogleBooks(title);
  if (googleCover) {
    return { cover: googleCover, source: 'Google Books' };
  }

  // Puis AniList (meilleur pour mangas/manhwas)
  const anilistResult = await searchAnilist(title);
  if (anilistResult) {
    return { cover: anilistResult.cover, source: 'AniList', matchedTitle: anilistResult.matchedTitle };
  }

  return null;
}

// 📊 Afficher stats
function displayStats(stats) {
  log.title('📊 STATISTIQUES');
  console.log(`Total traité        : ${colors.bright}${stats.processed}${colors.reset}`);
  console.log(`${colors.green}✓ Mises à jour      : ${stats.updated}${colors.reset}`);
  console.log(`${colors.cyan}→ Google Books      : ${stats.fromGoogle}${colors.reset}`);
  console.log(`${colors.magenta}→ AniList           : ${stats.fromAnilist}${colors.reset}`);
  console.log(`${colors.yellow}⊙ Déjà à jour       : ${stats.skipped}${colors.reset}`);
  console.log(`${colors.red}✗ Échecs            : ${stats.failed}${colors.reset}`);
  console.log(`\nTaux de succès      : ${colors.bright}${Math.round((stats.updated / stats.processed) * 100)}%${colors.reset}\n`);
}

// 🚀 Main
async function main() {
  const args = process.argv.slice(2);
  const batchSize = args.includes('--batch') ? parseInt(args[args.indexOf('--batch') + 1]) : null;
  const delay = args.includes('--delay') ? parseInt(args[args.indexOf('--delay') + 1]) : 3000;
  const skip = args.includes('--skip') ? parseInt(args[args.indexOf('--skip') + 1]) : 0;

  log.title('🚀 MISE À JOUR OPTIMISÉE DES COUVERTURES');
  
  if (batchSize) log.info(`Mode batch: ${batchSize} livres`);
  if (skip) log.info(`Début à partir du livre #${skip}`);
  log.info(`Délai entre requêtes: ${delay}ms`);

  const stats = {
    processed: 0,
    updated: 0,
    fromGoogle: 0,
    fromAnilist: 0,
    skipped: 0,
    failed: 0,
  };

  const progress = loadProgress();

  try {
    log.info('Chargement des livres...');
    const { data: books, error } = await supabase.from('books').select('*');

    if (error) {
      log.error(`Erreur: ${error.message}`);
      process.exit(1);
    }

    const toProcess = books.slice(skip, batchSize ? skip + batchSize : undefined);
    log.success(`${toProcess.length} livres à traiter`);

    log.title('🔄 TRAITEMENT');

    for (let i = 0; i < toProcess.length; i++) {
      const book = toProcess[i];
      
      if (progress.processed.includes(book.id)) {
        stats.skipped++;
        continue;
      }

      stats.processed++;
      log.progress(stats.processed, toProcess.length);

      console.log(`\n${colors.cyan}[${skip + i + 1}/${books.length}]${colors.reset} ${book.title}`);

      const result = await findBestCover(book.title);

      if (result && result.cover !== book.cover) {
        const { error: updateError } = await supabase
          .from('books')
          .update({ cover: result.cover })
          .eq('id', book.id);

        if (updateError) {
          log.error(`Échec MAJ`);
          stats.failed++;
          progress.failed.push(book.id);
        } else {
          log.success(`${result.source} → ${result.matchedTitle || 'Trouvé'}`);
          stats.updated++;
          if (result.source === 'Google Books') stats.fromGoogle++;
          if (result.source === 'AniList') stats.fromAnilist++;
          progress.processed.push(book.id);
        }
      } else if (result) {
        log.info('Déjà à jour');
        stats.skipped++;
        progress.processed.push(book.id);
      } else {
        log.warning('Aucune couverture trouvée');
        stats.failed++;
        progress.failed.push(book.id);
      }

      saveProgress(progress);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.log('\n');
    displayStats(stats);

    if (batchSize && skip + batchSize < books.length) {
      log.info(`\n💡 Pour continuer: node updateCovers-optimized.js --skip ${skip + batchSize} --batch ${batchSize}`);
    }

  } catch (error) {
    log.error(`Erreur fatale: ${error.message}`);
    process.exit(1);
  }
}

main();