📚 BookTime - Gestionnaire de bibliothèque de lectures
Une application React moderne et élégante pour gérer votre collection de livres, webtoons, mangas et autres lectures.

✨ Fonctionnalités
📖 Ajout manuel de lectures avec tous les détails
📥 Import en masse de listes de lectures
🏷️ Catégorisation par statut (En cours, Terminé, Arrêté)
⭐ Système de notation (0-10)
🔍 Recherche par titre ou auteur
🎨 Interface moderne avec design glassmorphism
💾 Sauvegarde automatique locale (localStorage)
📱 Design responsive adapté à tous les écrans
🚀 Installation
Prérequis
Node.js (v14 ou supérieur)
npm ou yarn
Étapes d'installation
bash
# 1. Créer le projet React
npx create-react-app booktime
cd booktime

# 2. Installer les dépendances
npm install lucide-react

# 3. Créer la structure des dossiers
mkdir -p src/components src/hooks src/utils src/styles
📁 Structure du projet
booktime/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Stats.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterTabs.jsx
│   │   ├── BookGrid.jsx
│   │   ├── BookCard.jsx
│   │   ├── ImportModal.jsx
│   │   ├── AddBookModal.jsx
│   │   └── BookDetailModal.jsx
│   ├── hooks/
│   │   ├── useBooks.js
│   │   └── useStorage.js
│   ├── utils/
│   │   ├── imageGenerator.js
│   │   └── importParser.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── README.md
🛠️ Configuration
1. Modifier public/index.html
Ajoutez Tailwind CSS dans le <head> :

html
<script src="https://cdn.tailwindcss.com"></script>
2. Créer tous les fichiers
Copiez les fichiers fournis dans leurs dossiers respectifs :

Composants : Dans src/components/
Hooks : Dans src/hooks/
Utils : Dans src/utils/
Styles : Dans src/styles/
App & Index : Dans src/
3. Fichier src/styles/global.css
css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscSELECT id, email, encrypted_password
FROM auth.users;
ale;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
4. Fichier src/index.jsx
javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
🎯 Utilisation
Démarrer en développement
bash
npm start
L'application sera accessible sur http://localhost:3000

Build pour production
bash
npm run build
Les fichiers optimisés seront dans le dossier build/

📥 Format d'import
L'application accepte différents formats pour l'import en masse :

Solo Leveling ep 179 End
Nano Machine ep 212
True Beauty ep 223
Tower of God
The Beginning After The End ep 150
Notes importantes :

Les emojis sont automatiquement supprimés
Le format "ep XXX" est optionnel
Une image de couverture est générée automatiquement pour chaque livre
🎨 Personnalisation
Couleurs
Les couleurs principales sont définies avec des classes Tailwind :

Primaire : teal-*
Secondaire : emerald-*
Accent : cyan-*
Modifiez les classes dans les composants pour changer le thème.

Images de couverture
Les images sont générées via Picsum avec un seed basé sur le titre. Vous pouvez modifier la fonction dans src/utils/imageGenerator.js pour utiliser un autre service.

🚀 Déploiement
Vercel
bash
npm i -g vercel
vercel
Netlify
bash
npm i -g netlify-cli
netlify deploy --prod
GitHub Pages
bash
npm install --save-dev gh-pages

# Ajouter dans package.json :
"homepage": "https://votre-username.github.io/booktime",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Déployer :
npm run deploy
🐛 Dépannage
Problème : Les images ne s'affichent pas
Vérifiez votre connexion internet (les images viennent de Picsum)
Essayez de vider le cache du navigateur
Problème : Les données ne sont pas sauvegardées
Vérifiez que le localStorage est activé dans votre navigateur
Essayez en navigation privée pour tester
Problème : Erreur lors de l'import
Vérifiez le format de votre liste
Assurez-vous qu'il n'y a pas de caractères spéciaux problématiques
📝 Licence
Ce projet est libre d'utilisation pour un usage personnel et éducatif.

🤝 Contribution
Les contributions sont les bienvenues ! N'hésitez pas à :

Reporter des bugs
Proposer de nouvelles fonctionnalités
Améliorer la documentation
📧 Contact
Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur le projet.

Fait avec ❤️ et React

1️⃣ Table auth.users

| Colonne                | Type        | Nullable | Description                         |
| ---------------------- | ----------- | -------- | ----------------------------------- |
| id                     | uuid        | NO       | Identifiant unique                  |
| aud                    | text        | NO       | Audience (`authenticated` ou autre) |
| role                   | text        | NO       | Rôle de l’utilisateur               |
| email                  | text        | YES      | Email de l’utilisateur              |
| encrypted_password     | text        | YES      | Mot de passe crypté                 |
| email_confirmed_at     | timestamptz | YES      | Date de confirmation de l’email     |
| phone                  | text        | YES      | Numéro de téléphone                 |
| phone_confirmed_at     | timestamptz | YES      | Date de confirmation du téléphone   |
| confirmation_token     | text        | YES      | Jeton de confirmation               |
| recovery_token         | text        | YES      | Jeton de récupération               |
| email_change_token_new | text        | YES      | Jeton pour changer d’email          |
| email_change           | text        | YES      | Nouvel email en cours de validation |
| created_at             | timestamptz | NO       | Date de création                    |
| updated_at             | timestamptz | NO       | Date de mise à jour                 |
| last_sign_in_at        | timestamptz | YES      | Dernière connexion                  |
| raw_user_meta_data     | jsonb       | YES      | Données brutes personnalisées       |
| user_metadata          | jsonb       | YES      | Données personnalisées              |
| factor                 | jsonb       | YES      | Auth multi-facteurs                 |

2️⃣ Table auth.identities

| Colonne         | Type           | Nullable | Description                                            |
| --------------- | -------------- | -------- | ------------------------------------------------------ |
| id              | uuid           | NO       | Identifiant unique                                     |
| user_id         | uuid           | NO       | Référence `auth.users.id`                              |
| provider        | text           | NO       | Nom du provider (`email`, `google`, `github`)          |
| provider_id     | text           | NO       | Identifiant du provider (souvent `email`)              |
| identity_data   | jsonb          | NO       | Données du provider (ex: `{sub: "...", email: "..."}`) |
| email           | text GENERATED | NO       | `lower(identity_data->>'email')`                       |
| last_sign_in_at | timestamptz    | YES      | Dernière connexion                                     |
| created_at      | timestamptz    | YES      | Date de création                                       |
| updated_at      | timestamptz    | YES      | Date de mise à jour                                    |

3️⃣ Table auth.refresh_tokens

| Colonne     | Type        | Nullable | Description                  |
| ----------- | ----------- | -------- | ---------------------------- |
| id          | uuid        | NO       | Identifiant du refresh token |
| user_id     | uuid        | NO       | Référence `auth.users.id`    |
| token       | text        | NO       | Token crypté                 |
| created_at  | timestamptz | NO       | Création du token            |
| revoked_at  | timestamptz | YES      | Date de révocation           |
| replaced_by | uuid        | YES      | Token qui remplace celui-ci  |
| expires_at  | timestamptz | YES      | Expiration                   |

4️⃣ Table auth.mfa (multi-factor authentication)

| Colonne      | Type        | Nullable | Description               |
| ------------ | ----------- | -------- | ------------------------- |
| id           | uuid        | NO       | Identifiant MFA           |
| user_id      | uuid        | NO       | Référence `auth.users.id` |
| factor_type  | text        | NO       | Type (`totp`, `sms`, ...) |
| factor_data  | jsonb       | YES      | Données du facteur        |
| created_at   | timestamptz | NO       | Création                  |
| updated_at   | timestamptz | NO       | Mise à jour               |
| confirmed_at | timestamptz | YES      | Date de confirmation      |

Relations principales

auth.identities.user_id → auth.users.id (ON DELETE CASCADE)

auth.refresh_tokens.user_id → auth.users.id (ON DELETE CASCADE)

auth.mfa.user_id → auth.users.id (ON DELETE CASCADE)