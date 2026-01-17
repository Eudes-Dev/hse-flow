"use client";

import { ChangeEvent } from "react";

export interface MetricsFormData {
  hoursWorked: string;
  accidentsCount: string;
  daysLost: string;
}

interface MetricsFormProps {
  values: MetricsFormData;
  onChange: (field: keyof MetricsFormData, value: string) => void;
  errors?: {
    hoursWorked?: string;
    accidentsCount?: string;
    daysLost?: string;
  };
}

export default function MetricsForm({
  values,
  onChange,
  errors,
}: MetricsFormProps) {
  const handleChange =
    (field: keyof MetricsFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      onChange(field, e.target.value);
    };

  const inputClasses = `
    w-full px-4 py-3 text-lg
    bg-white border-2 border-ui-gray
    rounded-lg
    focus:outline-none focus:border-safety-yellow
    transition-colors duration-200
    text-deep-black
    placeholder:text-deep-black/40
  `;

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="hours-worked"
          className="block text-sm font-medium text-deep-black mb-2"
        >
          Heures travaillées
        </label>
        <input
          id="hours-worked"
          type="number"
          min="0"
          max="10000000"
          value={values.hoursWorked}
          onChange={handleChange("hoursWorked")}
          placeholder="0"
          className={inputClasses}
          aria-invalid={!!errors?.hoursWorked}
          aria-describedby={errors?.hoursWorked ? "hours-error" : undefined}
        />
        {errors?.hoursWorked && (
          <p id="hours-error" className="mt-1 text-sm text-red-600">
            {errors.hoursWorked}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="accidents-count"
          className="block text-sm font-medium text-deep-black mb-2"
        >
          Nombre d&apos;accidents
        </label>
        <input
          id="accidents-count"
          type="number"
          min="0"
          max="1000000"
          value={values.accidentsCount}
          onChange={handleChange("accidentsCount")}
          placeholder="0"
          className={inputClasses}
          aria-invalid={!!errors?.accidentsCount}
          aria-describedby={
            errors?.accidentsCount ? "accidents-error" : undefined
          }
        />
        {errors?.accidentsCount && (
          <p id="accidents-error" className="mt-1 text-sm text-red-600">
            {errors.accidentsCount}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="days-lost"
          className="block text-sm font-medium text-deep-black mb-2"
        >
          Jours perdus
        </label>
        <input
          id="days-lost"
          type="number"
          min="0"
          max="1000000"
          value={values.daysLost}
          onChange={handleChange("daysLost")}
          placeholder="0"
          className={inputClasses}
          aria-invalid={!!errors?.daysLost}
          aria-describedby={errors?.daysLost ? "days-error" : undefined}
        />
        {errors?.daysLost && (
          <p id="days-error" className="mt-1 text-sm text-red-600">
            {errors.daysLost}
          </p>
        )}
      </div>
    </div>
  );
}
