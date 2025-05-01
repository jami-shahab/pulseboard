"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface ReleaseCadenceProps {
  repoOwner: string;
  repoName: string;
}

interface Release {
  tagName: string;
  publishedAt: string;
}

interface ReleaseCadenceData {
  averageDays: number | null;
  releaseCount: number;
  releases: Release[];
}

export default function ReleaseCadence({ repoOwner, repoName }: ReleaseCadenceProps) {
  const [data, setData] = useState<ReleaseCadenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/repos/${repoOwner}/${repoName}/release-cadence`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const result: ReleaseCadenceData = await response.json();
        setData(result);
      } catch (err: any) {
        console.error("Failed to fetch release cadence data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repoOwner, repoName]);

  return (
    <div className="bg-card rounded-xl shadow-subtle border border-border p-6 w-full">
      <h3 className="text-xl font-semibold text-primary mb-4">
        Recent Release Cadence
      </h3>
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-neutral-200 rounded w-full"></div>
          ))}
        </div>
      )}
      {error && (
         <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
           <p className="text-sm font-medium text-secondary-dark">Error Loading Releases</p>
           <p className="text-sm text-secondary-dark mt-1">{error}</p>
         </div>
      )}
      {!loading && !error && data && (
        <div>
          {data.averageDays !== null ? (
            <p className="text-neutral-700 mb-4">
              Average time between releases:{" "}
              <span className="font-semibold text-primary">{data.averageDays} days</span>
              <span className="text-sm text-neutral-500"> (based on last {data.releaseCount} releases)</span>
            </p>
          ) : (
            <p className="text-neutral-500 mb-4">Not enough release data to calculate average cadence.</p>
          )}

          <h4 className="text-sm font-medium text-neutral-600 mb-2 border-t border-neutral-200 pt-3">
            Recent Releases:
          </h4>
          {data.releases.length > 0 ? (
            <ul className="space-y-1">
              {data.releases.map(release => (
                <li key={release.tagName} className="text-sm text-neutral-700 flex justify-between">
                  <span>{release.tagName}</span>
                  <span className="text-neutral-500">
                    {dayjs(release.publishedAt).fromNow()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-neutral-500 text-sm">No recent valid releases found.</p>
          )}
        </div>
      )}
    </div>
  );
} 