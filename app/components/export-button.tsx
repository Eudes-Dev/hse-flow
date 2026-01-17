"use client";

import { useState, useRef } from "react";
import { actionGenerateReport } from "@/app/actions/generate-report";
import SafetyScorecard from "./safety-scorecard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportButtonProps {
  tf: number | null;
  tg: number | null;
}

/**
 * Composant ExportButton - Gère l'exportation en PNG et PDF
 * - PNG : Généré côté client avec html2canvas (fonctionne en mode offline)
 * - PDF : Généré côté serveur avec @react-pdf/renderer, fallback client-side avec jsPDF
 */
export default function ExportButton({
  tf,
  tg,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scorecardRef = useRef<HTMLDivElement>(null);

  // Vérifier si les données sont valides pour l'export
  const canExport = tf !== null && tg !== null && !isNaN(tf) && !isNaN(tg);

  /**
   * Génère et télécharge un PNG via html2canvas (côté client)
   */
  const handleExportPNG = async () => {
    if (!canExport || !scorecardRef.current) return;

    setIsExporting(true);
    setShowMenu(false);

    try {
      // Créer un conteneur caché pour le rendu
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "1024px";
      container.style.height = "1024px";
      document.body.appendChild(container);

      // Rendre le composant SafetyScorecard dans le conteneur
      const React = await import("react");
      const ReactDOM = await import("react-dom/client");
      const root = ReactDOM.createRoot(container);

      root.render(
        React.createElement(SafetyScorecard, {
          tf: tf!,
          tg: tg!,
          timestamp: new Date(),
        })
      );

      // Attendre que le rendu soit terminé
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capturer avec html2canvas
      const canvas = await html2canvas(container, {
        width: 1024,
        height: 1024,
        scale: 2, // Haute résolution
        backgroundColor: "#0B0B0B",
      });

      // Nettoyer
      root.unmount();
      document.body.removeChild(container);

      // Télécharger l'image
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `hse-flow-scorecard-${new Date()
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors de la génération PNG:", error);
      alert(
        "Erreur lors de la génération de l'image. Veuillez réessayer."
      );
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Génère et télécharge un PDF via Server Action ou fallback client-side
   */
  const handleExportPDF = async () => {
    if (!canExport) return;

    setIsExporting(true);
    setShowMenu(false);

    try {
      // Tentative avec Server Action
      try {
        const result = await actionGenerateReport({
          tf: tf!,
          tg: tg!,
          format: "pdf",
        });

        if (result.success && result.data) {
          // Télécharger le PDF généré côté serveur
          const byteCharacters = atob(result.data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download =
            result.filename || `hse-flow-scorecard-${new Date()
              .toISOString()
              .split("T")[0]
              .replace(/-/g, "")}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          return;
        }
      } catch (serverError) {
        // Fallback client-side si le Server Action échoue (mode offline)
        console.warn("Server Action failed, using client-side fallback:", serverError);
      }

      // Fallback client-side : générer PDF avec jsPDF et html2canvas
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "1024px";
      container.style.height = "1024px";
      document.body.appendChild(container);

      const React = await import("react");
      const ReactDOM = await import("react-dom/client");
      const root = ReactDOM.createRoot(container);

      root.render(
        React.createElement(SafetyScorecard, {
          tf: tf!,
          tg: tg!,
          timestamp: new Date(),
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(container, {
        width: 1024,
        height: 1024,
        scale: 2,
        backgroundColor: "#0B0B0B",
      });

      root.unmount();
      document.body.removeChild(container);

      // Créer le PDF avec jsPDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1024, 1024],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 1024, 1024);
      pdf.save(
        `hse-flow-scorecard-${new Date()
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "")}.pdf`
      );
    } catch (error) {
      console.error("Erreur lors de la génération PDF:", error);
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={!canExport || isExporting}
        className={`
          bg-safety-yellow hover:bg-safety-yellow/90 
          text-deep-black 
          font-semibold 
          py-3 px-6 
          rounded-lg 
          shadow-md 
          transition-colors
          disabled:opacity-50 
          disabled:cursor-not-allowed
          min-h-[44px]
          min-w-[120px]
        `}
        aria-label="Exporter les résultats"
        aria-expanded={showMenu}
        aria-haspopup="menu"
      >
        {isExporting ? "Export en cours..." : "Exporter"}
      </button>

      {showMenu && (
        <>
          {/* Overlay pour fermer le menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu déroulant */}
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border-2 border-ui-gray z-20 min-w-[200px]">
            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="w-full text-left px-4 py-3 hover:bg-ui-gray transition-colors first:rounded-t-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Exporter en PNG"
            >
              📷 Exporter en PNG
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full text-left px-4 py-3 hover:bg-ui-gray transition-colors last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed border-t border-ui-gray"
              aria-label="Exporter en PDF"
            >
              📄 Exporter en PDF
            </button>
          </div>
        </>
      )}

      {/* Conteneur caché pour le rendu du scorecard (non utilisé directement, mais nécessaire pour la référence) */}
      <div ref={scorecardRef} className="hidden" />
    </div>
  );
}
