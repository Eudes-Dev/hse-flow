import { metricsInputSchema } from "../validation";

describe("Validation Zod", () => {
  describe("metricsInputSchema", () => {
    it("devrait accepter des valeurs valides", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 1000000,
        accidentsCount: 5,
        daysLost: 10,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.hoursWorked).toBe(1000000);
        expect(result.data.accidentsCount).toBe(5);
        expect(result.data.daysLost).toBe(10);
      }
    });

    it("devrait rejeter des heures travaillées négatives", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: -1000,
        accidentsCount: 5,
        daysLost: 10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("supérieures à 0");
      }
    });

    it("devrait rejeter des heures travaillées à 0", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 0,
        accidentsCount: 5,
        daysLost: 10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("supérieures à 0");
      }
    });

    it("devrait rejeter des heures travaillées > 10,000,000", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 11000000,
        accidentsCount: 5,
        daysLost: 10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("10,000,000");
      }
    });

    it("devrait accepter zéro pour les accidents", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 1000000,
        accidentsCount: 0,
        daysLost: 10,
      });
      expect(result.success).toBe(true);
    });

    it("devrait rejeter des accidents négatifs", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 1000000,
        accidentsCount: -5,
        daysLost: 10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("négatif");
      }
    });

    it("devrait rejeter des accidents > 1,000,000", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 1000000,
        accidentsCount: 2000000,
        daysLost: 10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("1,000,000");
      }
    });

    it("devrait accepter zéro pour les jours perdus", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 1000000,
        accidentsCount: 5,
        daysLost: 0,
      });
      expect(result.success).toBe(true);
    });

    it("devrait rejeter des jours perdus négatifs", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 1000000,
        accidentsCount: 5,
        daysLost: -10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("négatif");
      }
    });

    it("devrait rejeter des jours perdus > 1,000,000", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 1000000,
        accidentsCount: 5,
        daysLost: 2000000,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("1,000,000");
      }
    });

    it("devrait rejeter les nombres décimaux", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 1000000.5,
        accidentsCount: 5,
        daysLost: 10,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("entier");
      }
    });

    it("devrait accepter les valeurs limites maximales", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 10000000,
        accidentsCount: 1000000,
        daysLost: 1000000,
      });
      expect(result.success).toBe(true);
    });

    it("devrait accepter les valeurs limites minimales", () => {
      const result = metricsInputSchema.safeParse({
        hoursWorked: 1,
        accidentsCount: 0,
        daysLost: 0,
      });
      expect(result.success).toBe(true);
    });
  });
});
