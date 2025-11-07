#!/usr/bin/env node

/**
 * 📘 Script de mise à jour des couvertures Supabase
 * 
 * Ce script parcourt tous les livres dans ta base Supabase
 * et met à jour leurs couvertures en cherchant sur AniList
 * 
 * Usage:
 *   node updateCovers.js
 * 
 * Prérequis:
 *   npm install @supabase/supabase-js node-fetch
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// 🔐 Configuration Supabase
const SUPABASE_URL = 'https://elqoienhnbfjucmuoxnq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscW9pZW5obmJmanVjbXVveG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTg2NzAsImV4cCI6MjA3ODA3NDY3MH0.m71Dsd0sDEfjv590gVsEF7aefJE8G_07t2Cog9VmIAk';
const ANILIST_API = 'https://graphql.anilist.co';

// Initialiser Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🎨 Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}\n`),
};

/**
 * 🔍 Recherche une couverture sur AniList
 */
async function searchAnilistCover(title) {
  // Nettoyer le titre
  const cleanTitle = title
    .replace(/\s*ep\s*\d+.*$/i, '')
    .replace(/\s*chapter\s*\d+.*$/i, '')
    .replace(/\s*end\s*$/i, '')
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
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.data?.Media?.coverImage) {
      const cover = data.data.Media.coverImage.extraLarge ||
                    data.data.Media.coverImage.large ||
                    data.data.Media.coverImage.medium;
      
      if (cover) {
        const matchedTitle = data.data.Media.title.romaji || 
                           data.data.Media.title.english || 
                           data.data.Media.title.native;
        return { cover, matchedTitle };
      }
    }
  } catch (error) {
    log.warning(`Erreur AniList pour "${cleanTitle}": ${error.message}`);
  }

  return null;
}

/**
 * 📊 Afficher les statistiques finales
 */
function displayStats(stats) {
  log.title('📊 STATISTIQUES FINALES');
  console.log(`Total de livres    : ${colors.bright}${stats.total}${colors.reset}`);
  console.log(`${colors.green}Mises à jour       : ${stats.updated}${colors.reset}`);
  console.log(`${colors.yellow}Déjà à jour        : ${stats.skipped}${colors.reset}`);
  console.log(`${colors.red}Échecs             : ${stats.failed}${colors.reset}`);
  console.log(`\nTaux de succès     : ${colors.bright}${Math.round((stats.updated / stats.total) * 100)}%${colors.reset}\n`);
}

/**
 * 🚀 Fonction principale
 */
async function updateAllCovers() {
  log.title('🚀 MISE À JOUR DES COUVERTURES SUPABASE');

  // Statistiques
  const stats = {
    total: 0,
    updated: 0,
    failed: 0,
    skipped: 0,
  };

  try {
    // 📥 Charger tous les livres
    log.info('Chargement des livres depuis Supabase...');
    const { data: books, error } = await supabase
      .from('books')
      .select('*');

    if (error) {
      log.error(`Erreur de chargement: ${error.message}`);
      process.exit(1);
    }

    stats.total = books.length;
    log.success(`${stats.total} livres chargés`);

    // 🔄 Parcourir tous les livres
    log.title('🔄 TRAITEMENT EN COURS...');

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const progress = `[${i + 1}/${stats.total}]`;

      console.log(`\n${colors.cyan}${progress}${colors.reset} ${book.title}`);

      // Rechercher une nouvelle couverture
      const result = await searchAnilistCover(book.title);

      if (result && result.cover && result.cover !== book.cover) {
        // Mettre à jour dans Supabase
        const { error: updateError } = await supabase
          .from('books')
          .update({ cover: result.cover })
          .eq('id', book.id);

        if (updateError) {
          log.error(`Échec de la mise à jour: ${updateError.message}`);
          stats.failed++;
        } else {
          log.success(`Couverture mise à jour (${result.matchedTitle})`);
          stats.updated++;
        }
      } else if (result && result.cover === book.cover) {
        log.info('Couverture déjà à jour');
        stats.skipped++;
      } else {
        log.warning('Aucune couverture trouvée sur AniList');
        stats.failed++;
      }

      // ⏱️ Pause pour éviter le rate limiting (2 secondes pour être sûr)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 📊 Afficher les résultats
    displayStats(stats);

  } catch (error) {
    log.error(`Erreur fatale: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// 🎬 Lancer le script
updateAllCovers();