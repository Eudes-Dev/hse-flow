"use client";

import { ChangeEvent } from "react";
import type { CoefficientStandard } from "@/app/lib/coefficients";
import {
  COEFFICIENT_LABELS,
  DEFAULT_COEFFICIENT_STANDARD,
} from "@/app/lib/coefficients";

interface CoefficientSelectorProps {
  value: CoefficientStandard;
  onChange: (standard: CoefficientStandard) => void;
  id?: string;
  label?: string;
  className?: string;
}

export default function CoefficientSelector({
  value,
  onChange,
  id = "coefficient-selector",
  label = "Standard de calcul",
  className = "",
}: CoefficientSelectorProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as CoefficientStandard);
  };

  const selectClasses = `
    w-full px-4 py-3 text-lg
    bg-white border-2 border-ui-gray
    rounded-lg
    focus:outline-none focus:border-safety-yellow
    transition-colors duration-200
    text-deep-black
    cursor-pointer
    min-h-[44px] md:min-h-[48px]
    touch-manipulation
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-deep-black mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        value={value || DEFAULT_COEFFICIENT_STANDARD}
        onChange={handleChange}
        className={selectClasses}
        aria-label={label}
        aria-describedby={`${id}-description`}
      >
        <option value="european">{COEFFICIENT_LABELS.european}</option>
        <option value="osha">{COEFFICIENT_LABELS.osha}</option>
      </select>
      <p
        id={`${id}-description`}
        className="mt-1 text-xs text-deep-black/60 sr-only"
      >
        Sélectionnez le standard de calcul pour les indicateurs TF et TG
      </p>
    </div>
  );
}
