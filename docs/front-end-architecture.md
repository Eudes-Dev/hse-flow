# 🏗️ Frontend Architecture: HSE-Flow

Version : 1.1 (Optimisée Server Actions)

Statut : Validé ✅

Auteur : Winston (Architecte) 🏗️

## Stack Technique

Framework : Next.js 14+ (App Router).

Logique Serveur : Server Actions pour les calculs normatifs et la génération de rapports.

Style : Tailwind CSS avec configuration de la palette personnalisée (Jaune #F2E41C, Noir #0B0B0B, Or #C9A227).

Animations : Framer Motion (Effect "Number Flow").

PWA : next-pwa pour le support offline et l'installation mobile.

## Architecture des Server Actions

actionCalculateMetrics : Valide les entrées avec Zod et retourne les TF/TG.

actionGenerateReport : Génère le visuel de la "Safety Scorecard" côté serveur pour alléger le client.

Stratégie Hybride : Utilisation d'un fallback client-side en cas d'absence de réseau pour garantir le fonctionnement PWA.

## Structure des Données & Persistance

Client-side : LocalStorage pour mémoriser les dernières saisies de Marc.

Sécurité : Aucune base de données. Les Server Actions traitent les données en mémoire et les renvoient immédiatement (Zero-persistence policy).
