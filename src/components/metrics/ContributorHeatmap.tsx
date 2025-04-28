"use client";

import React, { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css"; // Import default styles
import { Tooltip as ReactTooltip } from "react-tooltip"; // Use react-tooltip for better tooltips

interface HeatmapProps {
  repoOwner: string;
  repoName: string;
}

interface HeatmapData {
  date: string;
  count: number;
}

// Calculate start and end dates for the last year
const getEndDate = () => new Date();
const getStartDate = () => {
  const endDate = getEndDate();
  const startDate = new Date(endDate);
  startDate.setFullYear(endDate.getFullYear() - 1);
  startDate.setDate(endDate.getDate() + 1); // Start one day after a year ago
  return startDate;
};

export default function ContributorHeatmap({ repoOwner, repoName }: HeatmapProps) {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<string | null>(null);

  const startDate = getStartDate();
  const endDate = getEndDate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/repos/${repoOwner}/${repoName}/commit-activity`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const result: HeatmapData[] = await response.json();
        setData(result);
      } catch (err: any) {
        console.error("Failed to fetch heatmap data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repoOwner, repoName]); // Refetch if owner/name changes

  const getClassForValue = (value: HeatmapData | null) => {
    if (!value || value.count === 0) {
      return 'color-empty'; // Use default empty color
    }
    // Simple color scale based on commit count (adjust as needed)
    if (value.count >= 8) {
      return 'color-github-4'; 
    }
    if (value.count >= 5) {
      return 'color-github-3';
    }
    if (value.count >= 2) {
      return 'color-github-2';
    }
    return 'color-github-1';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-neutral-200 p-6 w-full max-w-4xl mx-auto relative">
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">
        Commit Activity (Last ~200 Commits)
      </h3>
      {loading && (
        <div className="h-40 animate-pulse bg-neutral-200 rounded-md"></div> // Simple pulse loader
      )}
      {error && (
         <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
           <p className="text-sm font-medium text-secondary-dark">Error Loading Heatmap</p>
           <p className="text-sm text-secondary-dark mt-1">{error}</p>
         </div>
      )}
      {!loading && !error && (
        <>
          <style>{`
            /* React Calendar Heatmap Customizations */
            .react-calendar-heatmap .color-empty {
              fill: #ebedf0; /* GitHub's light grey for empty */
            }
            .react-calendar-heatmap .color-github-1 {
              fill: #9be9a8; /* GitHub's light green */
            }
            .react-calendar-heatmap .color-github-2 {
              fill: #40c463;
            }
            .react-calendar-heatmap .color-github-3 {
              fill: #30a14e;
            }
            .react-calendar-heatmap .color-github-4 {
              fill: #216e39; /* GitHub's dark green */
            }
             /* Tooltip Styling */
            .heatmap-tooltip {
              background-color: rgba(0, 0, 0, 0.75) !important;
              color: white !important;
              padding: 4px 8px !important;
              border-radius: 4px !important;
              font-size: 12px !important;
            }
          `}</style>
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={data}
            classForValue={getClassForValue}
            tooltipDataAttrs={(value: HeatmapData) => {
                const dateStr = value.date ? new Date(value.date).toLocaleDateString() : 'date unknown';
                const count = value.count ?? 0;
                return {
                  'data-tooltip-id': 'heatmap-tooltip',
                  'data-tooltip-content': `${count} commit${count !== 1 ? 's' : ''} on ${dateStr}`,
                };
            }}
            showWeekdayLabels={true}
          />
          <ReactTooltip id="heatmap-tooltip" className="heatmap-tooltip" />
        </>
      )}
    </div>
  );
} 