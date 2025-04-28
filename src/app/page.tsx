"use client";

import { useQuery } from "@apollo/client";
import MetricCard from "@/components/metrics/MetricCard";
import { GET_REPO_INFO } from "@/graphql/queries";
// We cannot import the RSC directly into the Client Component
// import ContributorLeaderboard from "@/components/contributors/ContributorLeaderboard";

// Define the structure for the repo data used in this component
interface RepoInfo {
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

// Renamed client component
function RepoDetailClient({ owner, name }: { owner: string, name: string }) {
  // Fetch data using the useQuery hook
  const { loading, error, data } = useQuery<{ repository: RepoInfo }>(GET_REPO_INFO, {
    variables: { owner, name },
  });

  const repo = data?.repository;

  return (
    <div className="animate-fade-in">
      {/* Styled Data Card */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl border border-neutral-200 mb-8">
        <div className="p-8">
          <h2 className="uppercase tracking-wide text-sm text-primary font-semibold mb-1">
            Repository Details ({owner}/{name})
          </h2>
          {loading && <p className="text-neutral-500 animate-pulse">Loading repository data...</p>}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
              <p className="text-sm font-medium text-secondary-dark">
                Error Fetching Repo Details
              </p>
              <p className="text-sm text-secondary-dark mt-1">{error.message}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"> {/* Added margin-bottom */} 
        <MetricCard
          label="Open Issues"
          value={repo?.issues.totalCount}
          isLoading={loading}
          textColorClass="text-accent-dark"
        />
        <MetricCard
          label="Total Issues"
          value={repo?.allIssues.totalCount}
          isLoading={loading}
          textColorClass="text-neutral-700"
        />
        <MetricCard
          label="Latest Release"
          value={repo?.latestRelease?.tagName}
          unit={repo?.latestRelease?.publishedAt
            ? `(${new Date(repo.latestRelease.publishedAt).toLocaleDateString()})`
            : undefined
          }
          isLoading={loading}
          textColorClass="text-secondary-dark"
        />
      </div>
    </div>
  );
}

// ----- End of Client Component -----

// Import RSCs and other components needed by the Server Component
import ContributorLeaderboard from "@/components/contributors/ContributorLeaderboard";
import ContributorHeatmap from "@/components/metrics/ContributorHeatmap"; // Import Heatmap
import React from "react"; 

// Default export is now a Server Component
export default function Home() {
  // Hardcode example repo for now
  const owner = "facebook";
  const name = "react";

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-2 text-neutral-800">
        Welcome to Pulseboard
      </h1>
      <p className="text-lg text-center text-neutral-600 mb-12">
        Monitoring the heartbeat of Open Source, in real-time.
      </p>

      {/* Render the Client Component part */}
      <RepoDetailClient owner={owner} name={name} />

      {/* Render the Heatmap Client Component */}
      {/* Since it fetches its own data client-side, no Suspense needed here */}
      <div className="my-12"> {/* Add margin */} 
        <ContributorHeatmap repoOwner={owner} repoName={name} />
      </div>
      
      {/* Render the Leaderboard Server Component */}
      <React.Suspense fallback={<LeaderboardSkeleton />}>
        <ContributorLeaderboard repoOwner={owner} repoName={name} />
      </React.Suspense>

    </div>
  );
}

// Simple Skeleton for the Leaderboard loading state
const LeaderboardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg border border-neutral-200 p-6 w-full max-w-2xl mx-auto animate-pulse">
    <h3 className="text-xl font-semibold text-neutral-800 mb-4 h-6 bg-neutral-200 rounded w-1/2"></h3>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-neutral-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
