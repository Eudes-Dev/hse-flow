import { render, screen, fireEvent } from "@testing-library/react";
import CoefficientSelector from "../coefficient-selector";
import { DEFAULT_COEFFICIENT_STANDARD, COEFFICIENT_LABELS } from "@/app/lib/coefficients";

describe("CoefficientSelector", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("devrait rendre le sélecteur avec le label par défaut", () => {
    render(
      <CoefficientSelector
        value={DEFAULT_COEFFICIENT_STANDARD}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText("Standard de calcul")).toBeInTheDocument();
  });

  it("devrait rendre le sélecteur avec un label personnalisé", () => {
    render(
      <CoefficientSelector
        value={DEFAULT_COEFFICIENT_STANDARD}
        onChange={mockOnChange}
        label="Custom Label"
      />
    );

    expect(screen.getByLabelText("Custom Label")).toBeInTheDocument();
  });

  it("devrait afficher les deux options (Standard Européen et OSHA)", () => {
    render(
      <CoefficientSelector
        value={DEFAULT_COEFFICIENT_STANDARD}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("european");

    // Vérifier que les options sont présentes
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent(COEFFICIENT_LABELS.european);
    expect(options[1]).toHaveTextContent(COEFFICIENT_LABELS.osha);
  });

  it("devrait utiliser la valeur par défaut si aucune valeur n'est fournie", () => {
    render(
      <CoefficientSelector
        value={undefined as any}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue(DEFAULT_COEFFICIENT_STANDARD);
  });

  it("devrait appeler onChange avec 'european' quand Standard Européen est sélectionné", () => {
    render(
      <CoefficientSelector value="osha" onChange={mockOnChange} />
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "european" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("european");
  });

  it("devrait appeler onChange avec 'osha' quand OSHA est sélectionné", () => {
    render(
      <CoefficientSelector
        value={DEFAULT_COEFFICIENT_STANDARD}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "osha" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("osha");
  });

  it("devrait avoir l'attribut aria-label", () => {
    render(
      <CoefficientSelector
        value={DEFAULT_COEFFICIENT_STANDARD}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-label", "Standard de calcul");
  });

  it("devrait avoir l'attribut aria-describedby pour l'accessibilité", () => {
    render(
      <CoefficientSelector
        value={DEFAULT_COEFFICIENT_STANDARD}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-describedby");
  });

  it("devrait être accessible au clavier", () => {
    render(
      <CoefficientSelector
        value={DEFAULT_COEFFICIENT_STANDARD}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    select.focus();
    expect(select).toHaveFocus();

    fireEvent.keyDown(select, { key: "ArrowDown", code: "ArrowDown" });
    fireEvent.change(select, { target: { value: "osha" } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("devrait appliquer les classes CSS pour le style", () => {
    render(
      <CoefficientSelector
        value={DEFAULT_COEFFICIENT_STANDARD}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("focus:border-safety-yellow");
    expect(select).toHaveClass("min-h-[44px]");
  });
});
