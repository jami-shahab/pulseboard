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
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-primary">
        Welcome to Pulseboard
      </h1>
      <p className="text-lg text-center text-neutral-600 mb-10 sm:mb-16">
        Monitoring the heartbeat of Open Source, in real-time.
      </p>

      <RepoDetailClient 
        owner={owner} 
        name={name} 
        initialData={initialRepoData} 
        initialError={initialError} 
      />

      <h2 className="text-2xl font-semibold text-center mt-12 mb-8 text-secondary">Health Metrics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        <ContributorHeatmap repoOwner={owner} repoName={name} />
        <IssueVelocityChart repoOwner={owner} repoName={name} />
        <div className="lg:col-span-2">
          <ReleaseCadence repoOwner={owner} repoName={name} />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-center mt-12 mb-8 text-secondary">Top Contributors</h2>
      <React.Suspense fallback={<LeaderboardSkeleton />}>
        <ContributorLeaderboard repoOwner={owner} repoName={name} />
      </React.Suspense>

    </div>
  );
}

// Style Skeleton to match card style
const LeaderboardSkeleton = () => (
  <div className="bg-card rounded-xl shadow-subtle border border-border p-6 w-full max-w-2xl mx-auto animate-pulse">
    <div className="h-6 bg-neutral-200 rounded w-1/2 mb-6"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
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
