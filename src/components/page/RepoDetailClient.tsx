"use client";

import React from "react";
import MetricCard from "@/components/metrics/MetricCard";

// Define and EXPORT the structure for the repo data
export interface RepoInfo {
  id: string;
  nameWithOwner: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  pushedAt: string;
  issues: { totalCount: number };
  allIssues: { totalCount: number };
  latestRelease: {
    id: string;
    tagName: string;
    publishedAt: string;
  } | null;
}

// Define props for the client component
interface RepoDetailClientProps {
  owner: string;
  name: string;
  initialData: RepoInfo | null;
  initialError: string | null;
}

// Client component now receives initial data via props
export default function RepoDetailClient({ 
  owner, 
  name, 
  initialData,
  initialError
}: RepoDetailClientProps) {

  // Use state to hold data/error, potentially for future updates/refetches
  const [repo, setRepo] = React.useState<RepoInfo | null>(initialData);
  const [error, setError] = React.useState<string | null>(initialError);
  const [loading, setLoading] = React.useState<boolean>(!initialData && !initialError); // Initially loading only if no data/error passed

  // Basic loading state (could be more sophisticated)
  if (loading) {
      return <p className="text-center p-10 animate-pulse">Loading repository details...</p>;
  }

  return (
    <div className="animate-fade-in">
      {/* Styled Data Card */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl border border-neutral-200 mb-8">
        <div className="p-8">
          <h2 className="uppercase tracking-wide text-sm text-primary font-semibold mb-1">
            Repository Details ({owner}/{name})
          </h2>
          {/* Display initial error if present */}
          {error && !repo && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
              <p className="text-sm font-medium text-secondary-dark">
                Error Fetching Repo Details
              </p>
              <p className="text-sm text-secondary-dark mt-1">{error}</p>
            </div>
          )}
          {repo && (
            <div className="animate-bubble-pop">
              <p className="block mt-1 text-xl leading-tight font-semibold text-neutral-800">
                {repo.nameWithOwner}
              </p>
              <p className="mt-2 text-neutral-600">{repo.description || "No description provided."}</p>
              <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-wrap justify-between gap-4 text-sm text-neutral-500">
                <span>⭐ {repo.stargazerCount.toLocaleString()} stars</span>
                <span>🍴 {repo.forkCount.toLocaleString()} forks</span>
                <span>
                  Last updated:{" "}
                  {new Date(repo.pushedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Health Metrics Section */}
      <h2 className="text-2xl font-semibold text-neutral-700 text-center mb-6">
        Health Metrics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
        {/* Metrics now use state derived from props, loading handled above */}
        <MetricCard
          label="Open Issues"
          value={repo?.issues.totalCount}
          isLoading={!repo && !error} // Loading if no repo data and no error
          textColorClass="text-accent-dark"
        />
        <MetricCard
          label="Total Issues"
          value={repo?.allIssues.totalCount}
          isLoading={!repo && !error}
          textColorClass="text-neutral-700"
        />
        <MetricCard
          label="Latest Release"
          value={repo?.latestRelease?.tagName}
          unit={repo?.latestRelease?.publishedAt
            ? `(${new Date(repo.latestRelease.publishedAt).toLocaleDateString()})`
            : undefined
          }
          isLoading={!repo && !error}
          textColorClass="text-secondary-dark"
        />
      </div>
    </div>
  );
} 