// Remove all client-side code (useQuery, useState, useEffect, client components imports)
// Remove RepoDetailClient function definition

// Keep only imports needed for the Server Component part
import ContributorLeaderboard from "@/components/contributors/ContributorLeaderboard";
import ContributorHeatmap from "@/components/metrics/ContributorHeatmap";
import IssueVelocityChart from "@/components/metrics/IssueVelocityChart";
import ReleaseCadence from "@/components/metrics/ReleaseCadence";
import React from "react";
import RepoDetailClient from "@/components/page/RepoDetailClient";
import apolloClient from "@/lib/apollo/client"; // Import server-capable client
import { GET_REPO_INFO } from "@/graphql/queries";
import { RepoInfo } from "@/components/page/RepoDetailClient"; // Import type from client component

// Default export is the Server Component
export default async function Home() {
  // Hardcode example repo for now
  const owner = "facebook";
  const name = "react";

  // Fetch initial repo data server-side
  let initialRepoData: RepoInfo | null = null;
  let initialError: string | null = null;
  try {
    // Note: Apollo Client setup now correctly uses PAT server-side
    const { data, error } = await apolloClient.query<{ repository: RepoInfo }>({ 
      query: GET_REPO_INFO, 
      variables: { owner, name },
      // Consider fetch policy for RSC
      // fetchPolicy: 'cache-first',
    });
    if (error) throw error;
    initialRepoData = data?.repository ?? null;
  } catch (err: any) {
    console.error("Error fetching initial repo data:", err);
    initialError = err.message || "Failed to load repository details.";
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-2 text-neutral-800">
        Welcome to Pulseboard
      </h1>
      <p className="text-lg text-center text-neutral-600 mb-12">
        Monitoring the heartbeat of Open Source, in real-time.
      </p>

      {/* Render the Client Component part, passing initial data */}
      <RepoDetailClient 
        owner={owner} 
        name={name} 
        initialData={initialRepoData} 
        initialError={initialError} 
      />

      {/* Render Advanced Metrics (Client Components fetching own data) */}
      <div className="my-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ContributorHeatmap repoOwner={owner} repoName={name} />
        <IssueVelocityChart repoOwner={owner} repoName={name} />
        <div className="lg:col-span-2 mt-8 lg:mt-0">
          <ReleaseCadence repoOwner={owner} repoName={name} />
        </div>
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
