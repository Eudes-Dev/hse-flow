import {
  COEFFICIENTS,
  COEFFICIENT_LABELS,
  DEFAULT_COEFFICIENT_STANDARD,
  getCoefficientValue,
  type CoefficientStandard,
} from "../coefficients";

describe("Coefficients", () => {
  describe("COEFFICIENTS", () => {
    it("devrait contenir les coefficients corrects pour chaque standard", () => {
      expect(COEFFICIENTS.european).toBe(1_000_000);
      expect(COEFFICIENTS.osha).toBe(200_000);
    });
  });

  describe("COEFFICIENT_LABELS", () => {
    it("devrait contenir les labels corrects pour chaque standard", () => {
      expect(COEFFICIENT_LABELS.european).toBe("Standard Européen (1,000,000)");
      expect(COEFFICIENT_LABELS.osha).toBe("OSHA (200,000)");
    });
  });

  describe("DEFAULT_COEFFICIENT_STANDARD", () => {
    it("devrait être 'european' par défaut", () => {
      expect(DEFAULT_COEFFICIENT_STANDARD).toBe("european");
    });
  });

  describe("getCoefficientValue", () => {
    it("devrait retourner 1,000,000 pour 'european'", () => {
      expect(getCoefficientValue("european")).toBe(1_000_000);
    });

    it("devrait retourner 200,000 pour 'osha'", () => {
      expect(getCoefficientValue("osha")).toBe(200_000);
    });
  });
});
