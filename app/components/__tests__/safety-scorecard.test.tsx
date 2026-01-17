import { render, screen } from "@testing-library/react";
import SafetyScorecard from "../safety-scorecard";

describe("SafetyScorecard", () => {
  const defaultProps = {
    tf: 5.25,
    tg: 12.5,
    coefficient: "european" as const,
  };

  it("renders with correct TF and TG values", () => {
    render(<SafetyScorecard {...defaultProps} />);

    expect(screen.getByText("Taux de Fréquence (TF)")).toBeInTheDocument();
    expect(screen.getByText("Taux de Gravité (TG)")).toBeInTheDocument();
    expect(screen.getByText("5,25")).toBeInTheDocument();
    expect(screen.getByText("12,50")).toBeInTheDocument();
  });

  it("displays the coefficient label", () => {
    render(<SafetyScorecard {...defaultProps} />);

    expect(
      screen.getByText(/Standard Européen \(1,000,000\)/)
    ).toBeInTheDocument();
  });

  it("displays the OSHA coefficient when selected", () => {
    render(
      <SafetyScorecard {...defaultProps} coefficient="osha" />
    );

    expect(screen.getByText(/OSHA \(200,000\)/)).toBeInTheDocument();
  });

  it("displays the generation timestamp", () => {
    const timestamp = new Date("2024-01-15T14:30:00");
    render(
      <SafetyScorecard {...defaultProps} timestamp={timestamp} />
    );

    expect(screen.getByText(/Généré le/)).toBeInTheDocument();
  });

  it("formats numbers correctly with French locale", () => {
    render(<SafetyScorecard tf={1234.567} tg={9876.543} coefficient="european" />);

    expect(screen.getByText("1 234,57")).toBeInTheDocument();
    expect(screen.getByText("9 876,54")).toBeInTheDocument();
  });

  it("renders with HSE-Flow branding", () => {
    render(<SafetyScorecard {...defaultProps} />);

    expect(screen.getByText("HSE-Flow")).toBeInTheDocument();
    expect(screen.getByText("Safety Scorecard")).toBeInTheDocument();
  });
});
