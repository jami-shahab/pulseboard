import React from "react";
import apolloClient from "@/lib/apollo/client"; // Import the configured Apollo Client
import { GET_REPOSITORY_COMMITS } from "@/graphql/queries"; // Import the commits query
import Image from "next/image";

// Define the expected structure of a commit node from the query
interface CommitNode {
  id: string;
  committedDate: string;
  messageHeadline: string;
  author: {
    name: string | null;
    email: string | null;
    user: {
      id: string;
      login: string;
      avatarUrl: string;
      name: string | null;
    } | null; // User might not be linked
  };
}

// Define the structure for aggregated contributor data
interface ContributorStat {
  login: string;
  name: string | null;
  avatarUrl: string | null;
  commitCount: number;
}

interface ContributorLeaderboardProps {
  repoOwner: string;
  repoName: string;
  limit?: number; // How many commits to check (max 100 per query)
}

// Make this an async Server Component
export default async function ContributorLeaderboard({
  repoOwner,
  repoName,
  limit = 100, // Default to checking last 100 commits
}: ContributorLeaderboardProps) {

  let contributors: ContributorStat[] = [];
  let error: string | null = null;
  let isLoading = true; // Simulate loading state for RSC

  try {
    // Fetch commit data directly using the Apollo Client on the server
    const { data, loading } = await apolloClient.query({
      query: GET_REPOSITORY_COMMITS,
      variables: { owner: repoOwner, name: repoName, limit },
      // Consider fetch policy if caching server-side is desired
      // fetchPolicy: 'cache-first', 
    });

    isLoading = loading;

    const commits = data?.repository?.defaultBranchRef?.target?.history?.nodes as CommitNode[] || [];

    // Aggregate commit counts by contributor login
    const contributorMap: Record<string, ContributorStat> = {};
    commits.forEach(commit => {
      const login = commit.author?.user?.login;
      // Only count commits linked to a GitHub user login
      if (login) {
        if (!contributorMap[login]) {
          contributorMap[login] = {
            login: login,
            name: commit.author.user?.name || commit.author.name,
            avatarUrl: commit.author.user?.avatarUrl || null,
            commitCount: 0,
          };
        }
        contributorMap[login].commitCount++;
      }
    });

    // Convert map to array and sort by commit count descending
    contributors = Object.values(contributorMap).sort((a, b) => b.commitCount - a.commitCount);

  } catch (err: any) {
    console.error("Error fetching contributor data:", err);
    error = `Failed to load contributor data: ${err.message}`;
    isLoading = false; // Ensure loading stops on error
  }

  return (
    <div className="bg-card rounded-xl shadow-subtle border border-border p-6 w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Top Contributors (Last {limit} Commits)
      </h3>
      {isLoading && (
        <div className="space-y-3 animate-pulse">
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
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
          <p className="text-sm font-medium text-secondary-dark">Error</p>
          <p className="text-sm text-secondary-dark mt-1">{error}</p>
        </div>
      )}
      {!isLoading && !error && contributors.length === 0 && (
        <p className="text-neutral-500">No contributor data found for this period.</p>
      )}
      {!isLoading && !error && contributors.length > 0 && (
        <ul className="space-y-4">
          {contributors.map((contributor) => (
            <li key={contributor.login} className="flex items-center space-x-4 p-2 rounded-md hover:bg-neutral-100 transition-colors animate-fade-in">
              {contributor.avatarUrl && (
                <Image
                  src={contributor.avatarUrl}
                  alt={`${contributor.login}'s avatar`}
                  width={40}
                  height={40}
                  className="rounded-full border border-neutral-300"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-neutral-800">{contributor.login}</p>
                <p className="text-sm text-neutral-500">{contributor.name || "Name not available"}</p>
              </div>
              <span className="text-lg font-semibold text-primary">
                {contributor.commitCount} {contributor.commitCount === 1 ? "commit" : "commits"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 