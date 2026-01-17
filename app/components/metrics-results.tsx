"use client";

import { useMotionValue, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExportButton from "./export-button";

interface MetricsResultsProps {
  tf: number | null;
  tg: number | null;
  error?: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useMotionValueEvent(springValue, "change", (latest) => {
    setDisplayValue(Math.round(latest * 100) / 100);
  });

  return (
    <motion.span
      key={displayValue}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-4xl font-bold text-premium-gold tabular-nums"
    >
      {displayValue.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </motion.span>
  );
}

export default function MetricsResults({
  tf,
  tg,
  error,
}: MetricsResultsProps) {
  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 border-2 border-red-300">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border-2 border-ui-gray">
        <h2 className="text-sm font-medium text-deep-black/70 mb-2">
          Taux de Fréquence (TF)
        </h2>
        {tf !== null ? (
          <AnimatedNumber value={tf} />
        ) : (
          <span className="text-4xl font-bold text-deep-black/30">N/A</span>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 border-2 border-ui-gray">
        <h2 className="text-sm font-medium text-deep-black/70 mb-2">
          Taux de Gravité (TG)
        </h2>
        {tg !== null ? (
          <AnimatedNumber value={tg} />
        ) : (
          <span className="text-4xl font-bold text-deep-black/30">N/A</span>
        )}
      </div>

      {/* Bouton d'exportation */}
      {tf !== null && tg !== null && (
        <div className="flex justify-center pt-4">
          <ExportButton tf={tf} tg={tg} />
        </div>
      )}
    </div>
  );
}
