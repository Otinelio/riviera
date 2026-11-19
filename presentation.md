# Hotel Riviera Ramatou Plage — Présentation Projet

---

## 01 — Informations Générales

| Champ           | Détail                                                                        |
|-----------------|-------------------------------------------------------------------------------|
| **Nom**         | Hotel Riviera Ramatou Plage                                                   |
| **Type**        | Site web vitrine + Back-office admin + Room Service & Menus QR                |
| **Année**       | 2026                                                                          |
| **Client**      | Hotel Riviera Ramatou Plage (Lomé, Togo)                                      |
| **Secteur**     | Hôtellerie / Restauration / Tourisme                                          |
| **Adresse**     | Zone du Port Autonome, Baguida Beach, Lomé, Togo                              |
| **Déployé sur** | Cloudflare Pages / Vercel                                                     |

---

## 02 — Présentation

L'**Hotel Riviera Ramatou Plage** est un hôtel-resort de bord de mer situé à Baguida Beach, Lomé, au Togo. Il offre une expérience tropicale complète avec sa plage privée sur l'Atlantique, sa piscine, ses deux restaurants et ses espaces de loisirs.

Le projet consiste en une **application web moderne** (Single Page Application) qui fait office de vitrine premium, couplée à un **système de gestion hôtelière léger (PMS)** et de **room service digital**. Ce système intégré permet aux clients de découvrir l'hôtel et de scanner des QR codes dans leur chambre pour accéder aux menus ou passer commande. En coulisses, un back-office sécurisé par code PIN permet à la réception de gérer toutes les opérations de l'hôtel en temps réel (chambres, commandes, maintenance).

---

## 03 — Stack Technique

| Couche                | Technologie                                                |
|-----------------------|------------------------------------------------------------|
| **Framework**         | React 19 + Vite + TanStack Start                           |
| **Langage**           | TypeScript 5                                               |
| **Routing**           | TanStack Router (file-based routing type-safe)             |
| **State Management**  | Zustand (persisté en LocalStorage)                         |
| **Styling**           | Tailwind CSS v4 + tw-animate-css                           |
| **Composants UI**     | Radix UI primitives + class-variance-authority             |
| **Formulaires**       | React Hook Form + Zod (validation)                         |
| **Animations**        | Framer Motion + transitions CSS personnalisées             |
| **Génération QR**     | react-qr-code                                              |
| **Icônes**            | Lucide React                                               |
| **Déploiement**       | Cloudflare (via @cloudflare/vite-plugin & wrangler)        |

---

## 04 — Le Problème

Avant ce projet, un hôtel du standing du Riviera Ramatou Plage faisait face à plusieurs défis logistiques et de communication :
- **Absence de digitalisation sur place** : Les menus des restaurants et du room service étaient au format papier, nécessitant des réimpressions fréquentes et limitant l'interactivité pour le client.
- **Logistique interne fragmentée** : La réception recevait les commandes de room service, les demandes d'entretien (ménage) et les signalements de maintenance par de multiples canaux, sans outil centralisé pour le suivi.
- **Manque d'autonomie du personnel** : Il n'existait pas de système simple, sécurisé, et sans maintenance serveur lourde pour gérer l'état des chambres ou mettre à jour les tarifs des menus au quotidien.

**L'enjeu** : Créer un écosystème web "tout-en-un" agissant comme vitrine premium pour attirer de nouveaux clients (UI moderne, fluide) et comme outil opérationnel performant pour le personnel (QR codes, alertes sonores, dashboard), fonctionnant de manière extrêmement rapide à l'Edge.

---

## 05 — La Solution

### Vitrine Publique et Réservations
Un site web immersif au design "tropical et premium", articulé autour de transitions fluides et d'animations au scroll.
- **Pages dédiées** : Chambres (avec vues détaillées), Restaurants, Expériences, Événements, Galerie, Contact.
- **Parcours utilisateur optimisé** : Hero section impactante, barre de réservation rapide omniprésente, et widget WhatsApp flottant pour un contact instantané.

### Menus Digitaux et Room Service par QR Code
Le client flashe un QR code disposé dans sa chambre pour accéder immédiatement aux services de l'hôtel sur son mobile :
- **Menus dynamiques** : Restaurant, Bar, Petit-Déjeuner, Room Service.
- **Commande depuis la chambre** : Le client sélectionne ses articles, précise son numéro de chambre, et envoie sa commande de room service en un clic.

### Back-office Hôtelier (PMS léger)
Une interface d'administration exhaustive (11 modules), protégée par un PIN (auto-verrouillage inactif), conçue pour la réception :
- **Dashboard** : Vue d'ensemble des KPIs (chambres occupées, commandes du jour, demandes en attente).
- **Chambres** : Grille visuelle de l'état des 15 chambres (Libre, Occupée, Maintenance, Nettoyage) avec code couleur modifiable en un clic.
- **Room Service Live** : Kanban de suivi des commandes en temps réel. **Alerte sonore** (API Web Audio) déclenchée à l'arrivée d'une commande pour avertir le réceptionniste.
- **Menu** : CRUD complet pour gérer les articles, catégories, disponibilités et prix spéciaux (petit-déjeuner, navette aéroport).
- **Entretien & Maintenance** : Suivi centralisé des requêtes de ménage ou d'interventions techniques (avec notion d'urgence).
- **Avis** : Collecte des feedbacks clients post-séjour pour amélioration continue.
- **QR Codes** : Génération instantanée des QR codes formatés pour l'impression (CSS `print:hidden`).
- **Paramètres** : Export/Import manuel des données de l'hôtel (sauvegarde JSON) et modification des coordonnées globales.

---

## 06 — Ce Qui a Été Livré

| Livrable                               | Statut        |
|----------------------------------------|---------------|
| Site public vitrine (10+ pages)        | ✅ Livré       |
| Système de Room Service digital        | ✅ Livré       |
| Back-office admin complet (11 modules) | ✅ Livré       |
| Module de génération/impression QR     | ✅ Livré       |
| Store persistant Zustand (Local/Export)| ✅ Livré       |
| Configuration de déploiement Edge      | ✅ Livré       |

---

## 07 — Fonctionnalités Principales

**Côté site public :**
- Navigation extrêmement rapide type Single Page App avec TanStack Router.
- Design responsive avec animations poussées via Framer Motion.
- Pages de chambres et menus dynamiques avec paramètres d'URL fortement typés (`/chambre/$roomNumber`).
- Intégration transparente pour les réservations (formulaire guidé, liens WhatsApp).

**Côté logistique (Admin) :**
- **AudioContext API** : Notifications sonores natives pour le room service, s'activant même lorsque l'onglet n'est pas le focus principal.
- **Sécurité** : Authentification côté client par PIN (hashé) avec expiration de session via `setTimeout` réinitialisé par l'activité utilisateur.
- **Gestionnaire d'impression** : Vues de QR codes adaptées spécifiquement à la fonction d'impression du navigateur (`@media print`).
- **Base de données in-browser** : Stockage complet des entités dans le `localStorage` de l'appareil (Zustand persist), incluant une fonction d'export/import JSON pour les backups de fin de journée.

---

## 08 — Les Défis Techniques

| Défi                                   | Approche                                                                                  |
|----------------------------------------|-------------------------------------------------------------------------------------------|
| **Notifications en arrière-plan**      | Implémentation d'un oscillateur via `AudioContext` (beep 880Hz) s'assurant que le son se déclenche correctement sur tous les navigateurs lorsque de nouvelles commandes arrivent dans le store Zustand. |
| **Logistique des QR Codes**            | Utilisation de la librairie `react-qr-code` avec des URLs générées dynamiquement selon l'environnement (`window.location.origin`) + layout d'impression spécifique pour le staff. |
| **Gestion d'état complexe**            | Mise en place d'un store global avec `Zustand` (plus de 250 lignes) gérant 10 entités simultanément (réservations, commandes, chambres, etc.) avec typage strict TypeScript. |
| **Sécurité Admin sans Backend**        | Mot de passe (PIN) protégé via base64, session `sessionStorage` qui expire automatiquement grâce à des event listeners trackant l'inactivité (`mousemove`, `keydown`). |
| **Routage Moderne & Type-Safe**        | Exploitation de `TanStack Router` générant automatiquement l'arbre des routes, éliminant les erreurs d'URL invalides et optimisant le pre-fetching. |

---

## 09 — Ma Contribution

Projet développé **en solo**, couvrant tout le spectre technique et visuel :

- 🎨 **UI / UX Design** — Direction artistique premium, conception d'une palette de couleurs tropicale (navy, ivory, coral), animations fluides de navigation.
- ⚛️ **Frontend** — Mise en place de l'écosystème pointe React 19 + TanStack Start + Tailwind CSS 4.
- 🏗️ **Architecture d'état** — Création d'un store Zustand unifié agissant comme base de données en mémoire, avec logique de persistance et actions CRUD.
- 🛎️ **Développement Métier** — Création de A à Z du système de room service live, avec notifications sonores et vue Kanban pour la cuisine/réception.
- 🔧 **Outils Internes** — Intégration du générateur de QR codes et du gestionnaire de sauvegardes JSON.

---

## 10 — Chiffres Clés

| Métrique                                | Valeur         |
|-----------------------------------------|----------------|
| Modules d'administration                | 11             |
| Pages / Routes distinctes               | 12+            |
| Articles de menu par défaut             | 15+            |
| Types d'états de chambre gérés          | 4              |
| Entités gérées dans Zustand             | 10             |
| Stack technique principale              | React 19, TanStack Router, Tailwind 4 |

---

## 11 — Ce Qui Rend le Projet Unique

> **Une solution tout-en-un, du client à la réception.**
L'application ne s'arrête pas à la simple vitrine. Elle intègre directement dans le navigateur un véritable ERP hôtelier léger (PMS). De la consultation des chambres en ligne, à la commande d'une boisson depuis la plage, jusqu'à l'intervention du technicien de maintenance : tout est centralisé.

> **Le Room Service Digital & les Notifications Sonores.**
Fini les menus papier. L'application permet au personnel de générer ses propres QR codes. Lorsqu'un client scanne et commande depuis son téléphone, la tablette de la réception sonne littéralement grâce à l'API Web Audio (qui génère une fréquence sonore pure), recréant numériquement l'expérience d'une cloche de comptoir.

> **Performance et Modernité Absolue.**
Ce projet tire parti des technologies les plus récentes de l'écosystème : React 19, Tailwind v4, et TanStack Router. Il offre un routage garanti sans erreur (type-safe) et s'affranchit d'un backend lourd grâce à une architecture client robuste, rendant l'application d'une rapidité fulgurante.