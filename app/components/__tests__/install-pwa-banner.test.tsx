import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import InstallPwaBanner from "../install-pwa-banner";

// Mock LocalStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("InstallPwaBanner", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    // Reset matchMedia mock
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
  });

  it("ne s'affiche pas si l'application est déjà installée (standalone)", () => {
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: true,
      media: "(display-mode: standalone)",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const { container } = render(<InstallPwaBanner />);
    expect(container.firstChild).toBeNull();
  });

  it("ne s'affiche pas si la bannière a été fermée", () => {
    localStorageMock.setItem("hse-flow-pwa-banner-dismissed", "true");

    const { container } = render(<InstallPwaBanner />);
    expect(container.firstChild).toBeNull();
  });

  it("s'affiche quand beforeinstallprompt est déclenché", async () => {
    const mockPrompt = jest.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: "accepted" as const });

    const beforeInstallPromptEvent = new Event("beforeinstallprompt") as any;
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = mockPrompt;
    beforeInstallPromptEvent.userChoice = mockUserChoice;

    render(<InstallPwaBanner />);

    // Déclencher l'événement beforeinstallprompt
    window.dispatchEvent(beforeInstallPromptEvent);

    await waitFor(() => {
      expect(screen.getByText("Installer HSE Flow")).toBeInTheDocument();
    });

    expect(screen.getByText("Installer")).toBeInTheDocument();
  });

  it("masque la bannière après fermeture par l'utilisateur", async () => {
    const mockPrompt = jest.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: "accepted" as const });

    const beforeInstallPromptEvent = new Event("beforeinstallprompt") as any;
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = mockPrompt;
    beforeInstallPromptEvent.userChoice = mockUserChoice;

    const { container } = render(<InstallPwaBanner />);

    window.dispatchEvent(beforeInstallPromptEvent);

    await waitFor(() => {
      expect(screen.getByText("Installer HSE Flow")).toBeInTheDocument();
    });

    const dismissButton = screen.getByLabelText("Fermer la bannière");
    fireEvent.click(dismissButton);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });

    expect(localStorageMock.getItem("hse-flow-pwa-banner-dismissed")).toBe(
      "true"
    );
  });

  it("appelle prompt() lors du clic sur Installer", async () => {
    const mockPrompt = jest.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: "accepted" as const });

    const beforeInstallPromptEvent = new Event("beforeinstallprompt") as any;
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = mockPrompt;
    beforeInstallPromptEvent.userChoice = mockUserChoice;

    render(<InstallPwaBanner />);

    window.dispatchEvent(beforeInstallPromptEvent);

    await waitFor(() => {
      expect(screen.getByText("Installer HSE Flow")).toBeInTheDocument();
    });

    const installButton = screen.getByLabelText("Installer l'application");
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(mockPrompt).toHaveBeenCalledTimes(1);
    });
  });

  it("affiche 'Installation...' pendant l'installation", async () => {
    const mockPrompt = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          // Ne pas résoudre immédiatement pour tester l'état de chargement
          setTimeout(resolve, 100);
        })
    );
    const mockUserChoice = Promise.resolve({ outcome: "accepted" as const });

    const beforeInstallPromptEvent = new Event("beforeinstallprompt") as any;
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = mockPrompt;
    beforeInstallPromptEvent.userChoice = mockUserChoice;

    render(<InstallPwaBanner />);

    window.dispatchEvent(beforeInstallPromptEvent);

    await waitFor(() => {
      expect(screen.getByText("Installer HSE Flow")).toBeInTheDocument();
    });

    const installButton = screen.getByLabelText("Installer l'application");
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(screen.getByText("Installation...")).toBeInTheDocument();
    });
  });

  it("a les attributs ARIA appropriés pour l'accessibilité", async () => {
    const mockPrompt = jest.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: "accepted" as const });

    const beforeInstallPromptEvent = new Event("beforeinstallprompt") as any;
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = mockPrompt;
    beforeInstallPromptEvent.userChoice = mockUserChoice;

    render(<InstallPwaBanner />);

    window.dispatchEvent(beforeInstallPromptEvent);

    await waitFor(() => {
      const banner = screen.getByRole("banner");
      expect(banner).toHaveAttribute(
        "aria-label",
        "Invitation à installer l'application"
      );
    });
  });
});
