# Architecture des Server Actions
actionCalculateMetrics : Valide les entrées avec Zod et retourne les TF/TG.

actionGenerateReport : Génère le visuel de la "Safety Scorecard" côté serveur pour alléger le client.

Stratégie Hybride : Utilisation d'un fallback client-side en cas d'absence de réseau pour garantir le fonctionnement PWA.
