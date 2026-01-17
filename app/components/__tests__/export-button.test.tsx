import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExportButton from "../export-button";

// Mock html2canvas
jest.mock("html2canvas", () => {
  return jest.fn(() =>
    Promise.resolve({
      toDataURL: () => "data:image/png;base64,test",
    } as HTMLCanvasElement)
  );
});

// Mock jsPDF
jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    save: jest.fn(),
  }));
});

// Mock actionGenerateReport
jest.mock("@/app/actions/generate-report", () => ({
  actionGenerateReport: jest.fn(),
}));

// Mock React and ReactDOM for dynamic imports
jest.mock("react", () => {
  const React = jest.requireActual("react");
  return {
    ...React,
    createElement: jest.fn((component, props, ...children) => {
      return React.createElement(component, props, ...children);
    }),
  };
});

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
    unmount: jest.fn(),
  })),
}));

describe("ExportButton", () => {
  const defaultProps = {
    tf: 5.25,
    tg: 12.5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders export button when data is available", () => {
    render(<ExportButton {...defaultProps} />);

    expect(screen.getByRole("button", { name: /exporter/i })).toBeInTheDocument();
  });

  it("disables export button when data is invalid", () => {
    render(<ExportButton tf={null} tg={null} />);

    const button = screen.getByRole("button", { name: /exporter/i });
    expect(button).toBeDisabled();
  });

  it("shows menu when button is clicked", () => {
    render(<ExportButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: /exporter/i });
    fireEvent.click(button);

    expect(screen.getByText(/Exporter en PNG/i)).toBeInTheDocument();
    expect(screen.getByText(/Exporter en PDF/i)).toBeInTheDocument();
  });

  it("hides menu when overlay is clicked", async () => {
    render(<ExportButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: /exporter/i });
    fireEvent.click(button);

    expect(screen.getByText(/Exporter en PNG/i)).toBeInTheDocument();

    const overlay = document.querySelector(".fixed.inset-0");
    if (overlay) {
      fireEvent.click(overlay);

      await waitFor(() => {
        expect(screen.queryByText(/Exporter en PNG/i)).not.toBeInTheDocument();
      });
    }
  });

  it("shows exporting state when export is in progress", async () => {
    const { actionGenerateReport } = require("@/app/actions/generate-report");
    actionGenerateReport.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true, data: "test" }), 100)
        )
    );

    render(<ExportButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: /exporter/i });
    fireEvent.click(button);

    const pdfButton = screen.getByText(/Exporter en PDF/i);
    fireEvent.click(pdfButton);

    expect(screen.getByText(/Export en cours/i)).toBeInTheDocument();
  });
});
