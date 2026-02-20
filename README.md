# 💬 O'Chat - Application de messagerie avec IA

Un projet d'application web interactive développé dans le cadre de ma formation en conception et développement d'applications web.

## 📋 Description

**O'Chat** est une application de messagerie permettant d'interagir avec l'intelligence artificielle Mistral. L'application offre une interface utilisateur moderne et responsive pour créer des conversations, échanger avec l'IA, et conserver un historique complet des discussions grâce à une base de données locale.

## ✨ Fonctionnalités

- **Gestion des conversations** : Création, sélection et suppression de conversations
- **Messagerie en temps réel** : Échange de messages avec l'IA Mistral
- **Historique persistant** : Sauvegarde automatique des conversations dans PocketBase
- **Affichage Markdown** : Rendu élégant des réponses de l'IA avec formatage Markdown
- **Authentification API** : Gestion sécurisée du token Mistral via localStorage
- **Design responsive** : Interface adaptée mobile et desktop avec menu interactif
- **Effet Glassmorphism** : Design moderne et épuré inspiré des interfaces Apple

## 🛠️ Technologies Utilisées

- **Svelte** (v5.28.1) : Framework JavaScript réactif
- **Vite** (v6.3.5) : Outil de build rapide pour le développement
- **PocketBase** (v0.23.5) : Base de données locale avec API REST intégrée
- **Mistral AI API** : Intelligence artificielle pour la génération de réponses
- **svelte-exmarkdown** (v5.0.2) : Rendu des messages en Markdown
- **Lucide Icons** (@lucide/svelte v0.562.0) : Bibliothèque d'icônes modernes

## 📁 Structure du Projet

```
├── myapp/
│   ├── src/
│   │   ├── App.svelte           # Composant principal
│   │   ├── lib/
│   │   │   ├── MobileNav.svelte # Navigation mobile
│   │   │   ├── DesktopNav.svelte # Navigation desktop
│   │   │   └── state.svelte.js   # État partagé entre composants
│   │   ├── app.css              # Styles globaux
│   │   ├── reset.css            # Reset CSS
│   │   └── main.js              # Point d'entrée
│   ├── pocketbase/              # Base de données PocketBase
│   ├── index.html               # HTML principal
│   ├── package.json             # Dépendances du projet
│   └── vite.config.js           # Configuration Vite
├── doc/                         # Documentation et wireframes
```

## 🎨 Processus de Conception

### Recherches et Moodboard

Le projet a débuté par une phase de recherche approfondie sur les designs des LLM existants (ChatGPT, Claude, Mistral). J'ai créé un moodboard sur Figma pour rassembler mes inspirations, en utilisant :
- **[Fontjoy.com](https://fontjoy.com)** pour la sélection des polices harmonisées (Amiko + Fira Sans)
- **[Coolors](https://coolors.co)** pour la création de la palette de couleurs

![Moodboard O'Chat](/doc/moodboard-ochat.png)

### Wireframes sur Figma

Après la phase de recherche, j'ai conçu des wireframes détaillés sur Figma avec :
- **Deux versions** : Desktop et Mobile
- **Grilles en colonnes** pour assurer la cohérence du design
- **Menu responsive** : Version ouverte et fermée pour mobile

![Wireframe Desktop](/doc/wireframe-ochat-desktop.png)
![Wireframe Mobile - Menu ouvert](/doc/wireframe-ochat-mobile-menu-open.png)
![Wireframe Mobile - Menu fermé](/doc/wireframe-ochat-mobile-menu-close.png)

### Évolution du Design

Le design final s'écarte légèrement du wireframe initial, car j'ai souhaité me challenger et expérimenter avec :
- Le **Glassmorphism** (effet de flou sur verre) via `::before` pour éviter les problèmes de flou sur les éléments enfants
- Un **breakpoint unique à 1200px** pour une adaptation fluide entre mobile et desktop

![Desktop - Jour 1](/doc/jour1-desktop.png)
![Mobile - Jour 1](/doc/jour1-mobile.png)

## 🎯 Concepts Mis en Œuvre

- **Architecture composant Svelte** avec état partagé
- **Programmation réactive** avec Svelte 5 ($state, $effect)
- **Gestion d'API REST** avec fetch (Mistral AI et PocketBase)
- **Persistance des données** avec PocketBase
- **LocalStorage** pour la gestion du token d'authentification
- **Rendu dynamique** avec templates conditionnels
- **Design responsive** avec media queries
- **Gestion d'événements** et interactions utilisateur

## 🚀 Installation et Utilisation

### Prérequis

- **Node.js** (version 14 ou supérieure)
- **npm** (généralement inclus avec Node.js)
- **Compte Mistral AI** (pour obtenir une clé API)

### Installation

1. **Cloner le repository** et se rendre dans le dossier myapp

2. **Installer les dépendances** :
```bash
npm install
```

3. **Lancer PocketBase** :

```bash
cd myapp/pocketbase
./pocketbase serve
```

PocketBase sera accessible sur `http://localhost:8090`
Pour une première utilisation, il faudra créer un compte super user. 

4. **Obtenir une clé API Mistral** :

Rendez-vous sur le site de [Mistral](https://mistral.ai/fr/products/studio) pour créer un compte et votre clé API.

5. **Lancer l'application** :

Dans un nouveau terminal :
```bash
npm run dev
```

7. **Ouvrir votre navigateur** à l'adresse :
```
http://localhost:5173
```

## 🔐 Utilisation l'API Mistral

Le token est nécessaire pour chaque requête à l'API Mistral. Si vous souhaitez le modifier :
- Supprimer manuellement la clé `token` du localStorage via les DevTools
- Recharger l'application pour saisir un nouveau token

## 💾 Base de Données PocketBase

### Structure

#### **conversations**
- `id` : Identifiant unique de la conversation
- `title` : Titre de la conversation
- `created` : Date de création

#### **messages**
- `id` : Identifiant unique du message
- `role` : Rôle de l'émetteur (user ou assistant)
- `content` : Contenu du message
- `conversation` : Relation vers la table conversations
- `created` : Date de création

### Fonctionnalités

- **Création automatique** des messages à chaque échange
- **Récupération filtrée** des messages par conversation
- **Historique complet** avec horodatage

## 📝 Défis Techniques Rencontrés

### Jour 1 : Design et Intégration
- ✅ Maîtrise du Glassmorphism avec `::before`
- ✅ Personnalisation avancée du textarea
- ✅ Mise en place d'un design responsive avec un seul breakpoint

### Jour 2 : Intégration de l'API Mistral
- ✅ Compréhension de la documentation Mistral AI
- ✅ Gestion de l'affichage asynchrone des messages
- ✅ Formatage correct des messages pour l'API

### Jour 3 : Persistance avec PocketBase
- ✅ Configuration de PocketBase
- ✅ Mise en place des relations entre tables
- ✅ Correction du contexte de conversation (envoi de l'historique complet à Mistral)

### Jour 4 : Système de Conversations
- ✅ Gestion des états partagés entre composants Svelte
- ✅ Liaison dynamique entre conversations et messages
- ✅ Suppression de conversations avec actualisation de l'interface
- ✅ Remise en place du système de composants avec état partagé

## 📋 TODO

- [ ] Mettre un scroll smooth lors de l'ajout d'un nouveau message
- [ ] Ajouter un bouton pour supprimer le token
- [ ] Mettre en place un loader pendant l'attente de la réponse de l'IA
- [ ] Implémenter un système de recherche dans les conversations
- [ ] Ajouter la possibilité d'éditer le titre d'une conversation
- [ ] Créer un système d'export des conversations en fichier

## 🎯 Objectifs Pédagogiques

Ce projet m'a permis d'aborder les compétences suivantes :
- Le développement d'applications avec **Svelte** et **Vite**
- L'intégration d'**APIs externes** (Mistral AI)
- La gestion d'une **base de données locale** avec **PocketBase**
- L'architecture en **composants réactifs**
- Le **design responsive** mobile-first
- La gestion des **états partagés** entre composants
- Les **bonnes pratiques** en développement front-end moderne
- L'utilisation du **localStorage** pour la persistance côté client

---

*Projet réalisé dans le cadre d'un exercice de formation en développement web front-end*
