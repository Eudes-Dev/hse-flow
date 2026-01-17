import { actionGenerateReport } from "../generate-report";

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => {
  const mockPdf = jest.fn(() => ({
    toBlob: jest.fn(() => Promise.resolve(new Blob(["test"], { type: "application/pdf" }))),
  }));

  return {
    Document: ({ children }: { children: React.ReactNode }) => children,
    Page: ({ children }: { children: React.ReactNode }) => children,
    View: ({ children }: { children: React.ReactNode }) => children,
    Text: ({ children }: { children: React.ReactNode }) => children,
    StyleSheet: {
      create: (styles: any) => styles,
    },
    pdf: mockPdf,
  };
});

// Mock coefficients
jest.mock("@/app/lib/coefficients", () => ({
  COEFFICIENT_LABELS: {
    european: "Standard Européen (1,000,000)",
    osha: "OSHA (200,000)",
  },
}));

describe("actionGenerateReport", () => {
  const validInput = {
    tf: 5.25,
    tg: 12.5,
    coefficient: "european" as const,
    format: "pdf" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("validates input with Zod schema", async () => {
    const result = await actionGenerateReport({
      tf: -1,
      tg: 10,
      coefficient: "european",
      format: "pdf",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects PNG format (handled client-side)", async () => {
    const result = await actionGenerateReport({
      ...validInput,
      format: "png" as any,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Format non supporté");
  });

  it("generates PDF successfully with valid input", async () => {
    const result = await actionGenerateReport(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.mimeType).toBe("application/pdf");
    expect(result.filename).toContain("hse-flow-scorecard");
    expect(result.filename).toMatch(/\.pdf$/);
  });

  it("handles errors gracefully", async () => {
    const { pdf } = require("@react-pdf/renderer");
    pdf.mockImplementation(() => {
      throw new Error("PDF generation failed");
    });

    const result = await actionGenerateReport(validInput);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("validates that TG can be zero", async () => {
    const result = await actionGenerateReport({
      tf: 5.25,
      tg: 0,
      coefficient: "european",
      format: "pdf",
    });

    expect(result.success).toBe(true);
  });
});
