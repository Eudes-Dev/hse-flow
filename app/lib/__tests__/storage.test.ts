import {
  saveMetricsToStorage,
  loadMetricsFromStorage,
  clearMetricsStorage,
} from "../storage";
import type { MetricsFormData } from "@/app/components/metrics-form";

describe("LocalStorage", () => {
  beforeEach(() => {
    // Nettoyer LocalStorage avant chaque test
    localStorage.clear();
  });

  afterEach(() => {
    // Nettoyer après chaque test
    localStorage.clear();
  });

  describe("saveMetricsToStorage", () => {
    it("devrait sauvegarder les données dans LocalStorage", () => {
      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
      };

      saveMetricsToStorage(data);

      const stored = localStorage.getItem("hse-flow-metrics");
      expect(stored).not.toBeNull();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed).toEqual(data);
      }
    });

    it("devrait écraser les données existantes", () => {
      const data1: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
      };
      const data2: MetricsFormData = {
        hoursWorked: "2000000",
        accidentsCount: "10",
        daysLost: "20",
      };

      saveMetricsToStorage(data1);
      saveMetricsToStorage(data2);

      const loaded = loadMetricsFromStorage();
      expect(loaded).toEqual(data2);
    });

    it("ne devrait pas lancer d'erreur si LocalStorage est indisponible", () => {
      // Simuler l'indisponibilité de LocalStorage
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error("QuotaExceededError");
      });

      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
      };

      expect(() => saveMetricsToStorage(data)).not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe("loadMetricsFromStorage", () => {
    it("devrait charger les données depuis LocalStorage", () => {
      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
      };

      localStorage.setItem("hse-flow-metrics", JSON.stringify(data));

      const loaded = loadMetricsFromStorage();
      expect(loaded).toEqual(data);
    });

    it("devrait retourner null si aucune donnée n'est sauvegardée", () => {
      const loaded = loadMetricsFromStorage();
      expect(loaded).toBeNull();
    });

    it("devrait retourner null si les données sont corrompues", () => {
      localStorage.setItem("hse-flow-metrics", "invalid json");

      const loaded = loadMetricsFromStorage();
      expect(loaded).toBeNull();
    });

    it("devrait retourner null si les données ne correspondent pas au format attendu", () => {
      localStorage.setItem(
        "hse-flow-metrics",
        JSON.stringify({ invalid: "data" })
      );

      const loaded = loadMetricsFromStorage();
      expect(loaded).toBeNull();
    });

    it("ne devrait pas lancer d'erreur si LocalStorage est indisponible", () => {
      // Simuler l'indisponibilité de LocalStorage
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error("SecurityError");
      });

      expect(() => loadMetricsFromStorage()).not.toThrow();
      expect(loadMetricsFromStorage()).toBeNull();

      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe("clearMetricsStorage", () => {
    it("devrait supprimer les données de LocalStorage", () => {
      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
      };

      saveMetricsToStorage(data);
      expect(loadMetricsFromStorage()).not.toBeNull();

      clearMetricsStorage();
      expect(loadMetricsFromStorage()).toBeNull();
    });

    it("ne devrait pas lancer d'erreur si LocalStorage est vide", () => {
      expect(() => clearMetricsStorage()).not.toThrow();
    });

    it("ne devrait pas lancer d'erreur si LocalStorage est indisponible", () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error("SecurityError");
      });

      expect(() => clearMetricsStorage()).not.toThrow();

      Storage.prototype.removeItem = originalRemoveItem;
    });
  });

  describe("Intégration", () => {
    it("devrait permettre de sauvegarder, charger et supprimer les données", () => {
      const data: MetricsFormData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
      };

      // Sauvegarde
      saveMetricsToStorage(data);
      expect(loadMetricsFromStorage()).toEqual(data);

      // Modification
      const modifiedData: MetricsFormData = {
        hoursWorked: "2000000",
        accidentsCount: "10",
        daysLost: "20",
      };
      saveMetricsToStorage(modifiedData);
      expect(loadMetricsFromStorage()).toEqual(modifiedData);

      // Suppression
      clearMetricsStorage();
      expect(loadMetricsFromStorage()).toBeNull();
    });
  });

  describe("Migration des données anciennes", () => {
    it("devrait ignorer le coefficient s'il existe dans les données anciennes", () => {
      // Données anciennes avec coefficient (sera ignoré)
      const oldData = {
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "osha", // Sera ignoré
      };
      localStorage.setItem("hse-flow-metrics", JSON.stringify(oldData));

      const loaded = loadMetricsFromStorage();
      expect(loaded).not.toBeNull();
      if (loaded) {
        // Le coefficient est ignoré, seules les données principales sont retournées
        expect(loaded.hoursWorked).toBe("1000000");
        expect(loaded.accidentsCount).toBe("5");
        expect(loaded.daysLost).toBe("10");
      }
    });
  });
});
