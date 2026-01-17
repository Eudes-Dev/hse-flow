📊 Project Brief: HSE Calculator (TF/TG)
Date : 16 Janvier 2026 Auteur : Mary (Analyst) 📊 Statut : Validé / Prêt pour PRD

1. Executive Summary (Résumé)
L'objectif est de créer le "calculateur ultime" pour les professionnels de la Santé, Sécurité et Environnement (HSE). L'application permettra de calculer instantanément le Taux de Fréquence (TF) et le Taux de Gravité (TG) selon les standards internationaux, avec une interface "ultra-design" et une accessibilité totale (Gratuit, Offline, Mobile-first).

2. Goals & Objectives (Objectifs)
Précision Normative : Fournir un moteur de calcul infaillible basé sur les standards OSHA et OIT.

Expérience "Ultra-Design" : Proposer une UI/UX digne des meilleures SaaS modernes (animations, fluidité) pour surpasser l'usage d'Excel.

Mobilité & Offline : Garantir un fonctionnement parfait sur le terrain via une PWA (Progressive Web App), même sans connexion.

Adoption Communautaire : Offrir l'outil gratuitement pour établir une position de leader dans la communauté HSE mondiale.

3. Key Assumptions (Hypothèses Clés)
Multi-Standards : L'utilisateur doit pouvoir basculer entre le coefficient 10 
6
  (International) et 200000 (OSHA).

Confidentialité Totale : Les données sont traitées exclusivement côté client (navigateur). Aucun stockage serveur n'est requis pour le MVP.

Simplicité technique : Utilisation de Next.js et Tailwind CSS pour garantir performance et esthétique.

4. Constraints & Risks (Contraintes et Risques)
Budget 0€ : Développement et hébergement (Vercel/Netlify) sur des plans gratuits.

Risque de Précision : Une erreur de calcul discréditerait l'outil.

Mitigation : Tests unitaires automatisés et documentation transparente des formules.

Résistance au changement : Les utilisateurs sont habitués à leurs propres tableurs.

Mitigation : L'aspect "Ultra-Design" et la fonction d'exportation en "carte de score" (PDF/Image) sont les leviers de bascule.

5. Scope & MVP (Périmètre)
Inclus (MVP) :

Saisie des heures travaillées, accidents et jours perdus.

Toggle de sélection du référentiel (EU vs OSHA).

Calcul en temps réel.

Support PWA (Installation écran d'accueil + Offline).

Exportation visuelle des résultats (Image ou PDF).

Thèmes Clair/Sombre.

Exclu (V2+) :

Comptes utilisateurs et authentification.

Base de données Cloud.

Historisation et graphiques de tendances.

📝 Note de Mary (Analyst)
Ce document servira de fondation unique pour les étapes suivantes. Le choix de la PWA et du calcul local répond parfaitement aux contraintes de confidentialité des données HSE en entreprise tout en restant dans un budget de développement nul.