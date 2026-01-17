import { type CoefficientStandard, COEFFICIENT_LABELS } from "@/app/lib/coefficients";

interface SafetyScorecardProps {
  tf: number;
  tg: number;
  coefficient: CoefficientStandard;
  timestamp?: Date;
}

/**
 * Composant SafetyScorecard - Template de carte de score pour l'export
 * Format carré avec design system HSE-Flow (Or Premium, Noir Profond)
 */
export default function SafetyScorecard({
  tf,
  tg,
  coefficient,
  timestamp = new Date(),
}: SafetyScorecardProps) {
  const formattedDate = timestamp.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="bg-deep-black text-white flex flex-col items-center justify-center p-8"
      style={{
        width: "1024px",
        height: "1024px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* En-tête : Branding HSE-Flow */}
      <div className="mb-12 text-center">
        <h1
          className="text-5xl font-bold mb-2"
          style={{ color: "#C9A227" }}
        >
          HSE-Flow
        </h1>
        <p className="text-lg" style={{ color: "#F4F4F4" }}>
          Safety Scorecard
        </p>
      </div>

      {/* Corps : TF et TG */}
      <div className="flex flex-col gap-8 w-full max-w-2xl mb-12">
        {/* Taux de Fréquence (TF) */}
        <div className="bg-deep-black border-2 p-8 rounded-lg" style={{ borderColor: "#C9A227" }}>
          <h2 className="text-2xl font-medium mb-4" style={{ color: "#F4F4F4" }}>
            Taux de Fréquence (TF)
          </h2>
          <div
            className="text-7xl font-bold tabular-nums"
            style={{ color: "#C9A227" }}
          >
            {tf.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        {/* Taux de Gravité (TG) */}
        <div className="bg-deep-black border-2 p-8 rounded-lg" style={{ borderColor: "#C9A227" }}>
          <h2 className="text-2xl font-medium mb-4" style={{ color: "#F4F4F4" }}>
            Taux de Gravité (TG)
          </h2>
          <div
            className="text-7xl font-bold tabular-nums"
            style={{ color: "#C9A227" }}
          >
            {tg.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      {/* Pied : Coefficient et Date */}
      <div className="text-center text-sm" style={{ color: "#F4F4F4" }}>
        <p className="mb-2">
          Coefficient : {COEFFICIENT_LABELS[coefficient]}
        </p>
        <p>Généré le {formattedDate}</p>
      </div>
    </div>
  );
}
