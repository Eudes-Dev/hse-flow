# 📋 Product Requirements Document (PRD): HSE-Flow

Version : 1.0

Statut : Validé ✅

Auteur : John (Product Manager) 📋

## Objectifs & Contexte

Vision : Remplacer les outils Excel par une application PWA ultra-design pour le calcul des indicateurs de sécurité (TF/TG).

Valeur ajoutée : Gratuité, confidentialité totale (client-side), précision normative (OSHA/OIT) et usage offline.

## User Personas

Marc (Terrain) : Besoin de rapidité sur mobile, gros boutons, mode sombre pour l'extérieur.

Julie (Corporate) : Besoin de basculer entre les standards (10
6
vs 200000) sur Desktop.

Thomas (Consultant) : Besoin d'exporter des visuels propres pour ses rapports.

## User Stories (Priorités P0)

US.1 : Saisie et calcul en temps réel du TF/TG.

US.2 : Sélecteur de coefficient (Standard Européen vs OSHA).

US.3 : Installation PWA pour usage sans connexion.

US.4 : Exportation des résultats en format image/carte de score.

## Spécifications Fonctionnelles

Moteur : Calcul dynamique sans rechargement de page.

Stockage : Sauvegarde locale automatique (LocalStorage).

Offline : Service Workers pour la mise en cache des ressources.

## Exigences Non-Fonctionnelles

Performance : Chargement < 1.5s, réponse UI < 100ms.

Design : Accessibilité WCAG AA, interface moderne "SaaS-like".

Confidentialité : Aucune donnée n'est envoyée vers un serveur.
