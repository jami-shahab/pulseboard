import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number | undefined;
  unit?: string; // Optional unit (e.g., 'days ago')
  isLoading: boolean;
  bgColorClass?: string; // Allow custom background color
  textColorClass?: string; // Allow custom text color
}

export default function MetricCard({
  label,
  value,
  unit,
  isLoading,
  bgColorClass = "bg-white", // Default white background
  textColorClass = "text-primary", // Default primary color for value
}: MetricCardProps) {
  return (
    <div
      className={` ${bgColorClass} rounded-lg shadow-md p-4 border border-neutral-200 transition-shadow hover:shadow-lg`}
    >
      <p className="text-sm text-neutral-500 mb-1">{label}</p>
      {isLoading ? (
        <div className="h-6 bg-neutral-200 rounded animate-pulse w-3/4"></div> // Skeleton loader
      ) : (
        <p className={`text-2xl font-semibold ${textColorClass}`}>
          {value ?? "N/A"} {unit && <span className="text-sm font-normal text-neutral-500">{unit}</span>}
        </p>
      )}
    </div>
  );
} 