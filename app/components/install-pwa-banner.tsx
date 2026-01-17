"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const BANNER_DISMISSED_KEY = "hse-flow-pwa-banner-dismissed";

/**
 * Détecte si l'application est déjà installée comme PWA
 */
function isPWAInstalled(): boolean {
  if (typeof window === "undefined") return false;

  // Détection pour les navigateurs Chromium (Chrome, Edge)
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  // Détection pour iOS Safari
  if (
    (window.navigator as any).standalone === true ||
    (window.matchMedia as any)("(display-mode: standalone)").matches
  ) {
    return true;
  }

  return false;
}

/**
 * Vérifie si la bannière a été fermée par l'utilisateur
 */
function isBannerDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(BANNER_DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Marque la bannière comme fermée dans LocalStorage
 */
function dismissBanner(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  } catch (error) {
    console.warn("Impossible de sauvegarder la préférence:", error);
  }
}

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Ne pas afficher si déjà installé ou si la bannière a été fermée
    if (isPWAInstalled() || isBannerDismissed()) {
      setIsVisible(false);
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher la bannière par défaut du navigateur
      e.preventDefault();
      // Stocker l'événement pour l'utiliser plus tard
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    // Nettoyer l'écouteur d'événements
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);

    try {
      // Afficher l'invite d'installation
      await deferredPrompt.prompt();

      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("L'utilisateur a accepté l'installation");
        setIsVisible(false);
      } else {
        console.log("L'utilisateur a refusé l'installation");
      }

      // Réinitialiser l'événement
      setDeferredPrompt(null);
    } catch (error) {
      console.error("Erreur lors de l'installation:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    dismissBanner();
    setIsVisible(false);
  };

  // Ne pas rendre le composant si invisible
  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-4 duration-300"
      role="banner"
      aria-label="Invitation à installer l'application"
    >
      <div className="bg-white rounded-lg shadow-xl border-2 border-safety-yellow p-4 md:p-5 flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center">
        <div className="flex-1 space-y-1">
          <h3 className="text-base md:text-lg font-semibold text-deep-black">
            Installer HSE Flow
          </h3>
          <p className="text-sm text-deep-black/70">
            Installez l&apos;application pour un accès rapide et un usage offline
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="px-4 py-2 bg-safety-yellow text-deep-black font-medium rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-safety-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
            aria-label="Installer l'application"
          >
            {isInstalling ? "Installation..." : "Installer"}
          </button>

          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-deep-black/60 hover:text-deep-black focus:outline-none focus:ring-2 focus:ring-deep-black focus:ring-offset-2 rounded-lg transition-colors text-sm md:text-base"
            aria-label="Fermer la bannière"
            title="Fermer"
          >
            <span className="sr-only">Fermer</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
