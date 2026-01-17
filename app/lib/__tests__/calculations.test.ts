import {
  calculateTF,
  calculateTG,
  calculateMetrics,
  type CalculationResult,
} from "../calculations";
import type { CoefficientStandard } from "../coefficients";

describe("Calculations", () => {
  describe("calculateTF", () => {
    it("devrait calculer correctement le TF selon la formule standard", () => {
      // TF = (5 accidents / 1,000,000 heures) × 1,000,000 = 5
      const result = calculateTF(5, 1000000, 1000000);
      expect(result).toBe(5);
    });

    it("devrait calculer le TF avec des valeurs réelles", () => {
      // TF = (2 accidents / 500,000 heures) × 1,000,000 = 4
      const result = calculateTF(2, 500000, 1000000);
      expect(result).toBe(4);
    });

    it("devrait lancer une erreur si les heures travaillées sont à 0", () => {
      expect(() => calculateTF(5, 0, 1000000)).toThrow(
        "Les heures travaillées doivent être supérieures à 0"
      );
    });

    it("devrait gérer les très grandes valeurs", () => {
      const result = calculateTF(100, 10000000, 1000000);
      expect(result).toBe(10);
      expect(Number.isFinite(result)).toBe(true);
    });
  });

  describe("calculateTG", () => {
    it("devrait calculer correctement le TG selon la formule standard", () => {
      // TG = (10 jours / 1,000,000 heures) × 1,000 = 0.01
      const result = calculateTG(10, 1000000, 1000000);
      expect(result).toBe(0.01);
    });

    it("devrait calculer le TG avec des valeurs réelles", () => {
      // TG = (20 jours / 500,000 heures) × 1,000 = 0.04
      const result = calculateTG(20, 500000, 1000000);
      expect(result).toBe(0.04);
    });

    it("devrait lancer une erreur si les heures travaillées sont à 0", () => {
      expect(() => calculateTG(10, 0, 1000000)).toThrow(
        "Les heures travaillées doivent être supérieures à 0"
      );
    });

    it("devrait gérer les très grandes valeurs", () => {
      // TG = (1000 jours / 10,000,000 heures) × 1,000 = 0.1
      const result = calculateTG(1000, 10000000, 1000000);
      expect(result).toBe(0.1);
      expect(Number.isFinite(result)).toBe(true);
    });
  });

  describe("calculateMetrics", () => {
    it("devrait retourner null si les heures travaillées sont vides", () => {
      const result = calculateMetrics({
        hoursWorked: "",
        accidentsCount: "5",
        daysLost: "10",
      });
      expect(result.tf).toBeNull();
      expect(result.tg).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it("devrait retourner une erreur si les heures travaillées sont à 0", () => {
      const result = calculateMetrics({
        hoursWorked: "0",
        accidentsCount: "5",
        daysLost: "10",
      });
      expect(result.tf).toBeNull();
      expect(result.tg).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error).toContain("supérieures à 0");
    });

    it("devrait calculer correctement les deux indicateurs", () => {
      const result = calculateMetrics({
        hoursWorked: "1000000",
        accidentsCount: "2",
        daysLost: "10",
      });
      // TF = (2 / 1,000,000) × 1,000,000 = 2
      // TG = (10 / 1,000,000) × 1,000 = 0.01
      expect(result.tf).toBe(2);
      expect(result.tg).toBe(0.01);
      expect(result.error).toBeUndefined();
    });

    it("devrait accepter des nombres en string ou en number", () => {
      const result1 = calculateMetrics({
        hoursWorked: "1000000",
        accidentsCount: "2",
        daysLost: "10",
      });
      const result2 = calculateMetrics({
        hoursWorked: 1000000,
        accidentsCount: 2,
        daysLost: 10,
      });
      expect(result1.tf).toBe(result2.tf);
      expect(result1.tg).toBe(result2.tg);
    });

    it("devrait valider avec Zod et retourner une erreur pour des valeurs invalides", () => {
      const result = calculateMetrics({
        hoursWorked: "-1000",
        accidentsCount: "5",
        daysLost: "10",
      });
      expect(result.tf).toBeNull();
      expect(result.tg).toBeNull();
      expect(result.error).toBeDefined();
    });

    it("devrait valider les limites maximales", () => {
      const result = calculateMetrics({
        hoursWorked: "20000000", // > 10,000,000
        accidentsCount: "5",
        daysLost: "10",
      });
      expect(result.error).toBeDefined();
      expect(result.error).toContain("10,000,000");
    });

    it("devrait gérer le cas de division par zéro", () => {
      const result = calculateMetrics({
        hoursWorked: "0",
        accidentsCount: "5",
        daysLost: "10",
      });
      expect(result.tf).toBeNull();
      expect(result.tg).toBeNull();
    });

    it("devrait accepter zéro pour les accidents et jours perdus", () => {
      const result = calculateMetrics({
        hoursWorked: "1000000",
        accidentsCount: "0",
        daysLost: "0",
      });
      expect(result.tf).toBe(0);
      expect(result.tg).toBe(0);
      expect(result.error).toBeUndefined();
    });

    it("devrait utiliser le Standard Européen par défaut (coefficient 1,000,000)", () => {
      const result = calculateMetrics({
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
      });
      // TF = (5 / 1,000,000) × 1,000,000 = 5
      // TG = (10 / 1,000,000) × 1,000 = 0.01
      expect(result.tf).toBe(5);
      expect(result.tg).toBe(0.01);
    });

    it("devrait utiliser le coefficient Standard Européen (1,000,000) quand spécifié", () => {
      const result = calculateMetrics({
        hoursWorked: "1000000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "european",
      });
      // TF = (5 / 1,000,000) × 1,000,000 = 5
      // TG = (10 / 1,000,000) × 1,000 = 0.01
      expect(result.tf).toBe(5);
      expect(result.tg).toBe(0.01);
    });

    it("devrait utiliser le coefficient OSHA (200,000) quand spécifié", () => {
      const result = calculateMetrics({
        hoursWorked: "500000",
        accidentsCount: "5",
        daysLost: "10",
        coefficient: "osha",
      });
      // TF = (5 / 500,000) × 1,000,000 = 10 (TF utilise toujours 1,000,000)
      // TG = (10 / 500,000) × 1,000 = 0.02 (TG utilise toujours 1,000)
      expect(result.tf).toBe(10);
      expect(result.tg).toBe(0.02);
    });

    it("devrait calculer de la même manière avec Standard Européen vs OSHA (coefficient n'affecte plus le calcul)", () => {
      const europeanResult = calculateMetrics({
        hoursWorked: "1000000",
        accidentsCount: "10",
        daysLost: "20",
        coefficient: "european",
      });
      const oshaResult = calculateMetrics({
        hoursWorked: "1000000",
        accidentsCount: "10",
        daysLost: "20",
        coefficient: "osha",
      });

      // TF utilise toujours 1,000,000, donc identique pour les deux
      // TF = (10 / 1,000,000) × 1,000,000 = 10
      expect(europeanResult.tf).toBe(10);
      expect(oshaResult.tf).toBe(10);

      // TG utilise toujours 1,000, donc identique pour les deux
      // TG = (20 / 1,000,000) × 1,000 = 0.02
      expect(europeanResult.tg).toBe(0.02);
      expect(oshaResult.tg).toBe(0.02);
    });
  });

  describe("Performance des calculs", () => {
    it("devrait calculer en moins de 100ms", () => {
      const startTime = performance.now();
      calculateMetrics({
        hoursWorked: "10000000",
        accidentsCount: "1000000",
        daysLost: "1000000",
      });
      const endTime = performance.now();
      const latency = endTime - startTime;
      expect(latency).toBeLessThan(100);
    });

    it("devrait gérer des calculs répétés sans dégradation", () => {
      const iterations = 100;
      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        calculateMetrics({
          hoursWorked: "1000000",
          accidentsCount: String(i),
          daysLost: String(i * 2),
        });
      }
      const endTime = performance.now();
      const avgLatency = (endTime - startTime) / iterations;
      expect(avgLatency).toBeLessThan(10); // Moyenne < 10ms
    });
  });
});
