import React from 'react';
import { RepoResultCard } from './RepoResultCard'; // Import the new card component

// Define RepoData again or import from shared location
interface RepoData {
    id: string;
    name: string;
    description?: string | null;
    url: string;
    stargazerCount: number;
    forkCount: number;
    openIssues: {
        totalCount: number;
    };
    defaultBranchRef?: {
        target?: {
            history?: {
                totalCount: number;
            } | null;
        } | null;
    } | null;
}

interface RepoResultsListProps {
  results: RepoData[]; // Changed from repositoryData to results array
  error: any; // Consider a more specific error type
  loading: boolean; // Represents loading state of the *latest* fetch
}

export const RepoResultsList: React.FC<RepoResultsListProps> = ({ results, error, loading }) => {

  const hasResults = results.length > 0;

  return (
    <div className="mt-6 w-full">
      {/* Display Latest Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md animate-fadeIn">
          <p className="font-semibold">Error fetching latest repository:</p>
          <p>{error.message}</p>
          <p className="text-sm mt-1">Please check the owner/repository name. If it's a private repository, ensure you are signed in with sufficient permissions.</p>
        </div>
      )}

      {/* Display Loading Indicator for the latest fetch */}
      {loading && (
          <div className="text-center text-gray-500 py-4">Loading latest repository data...</div>
      )}

      {/* Display Initial Prompt or No Results Message */}
      {!loading && !hasResults && !error && (
          <p className="text-center text-gray-500 mt-6">Enter a repository (owner/name) above and click 'Fetch Data' to see results here.</p>
      )}

      {/* Display List of Result Cards */}
      {hasResults && (
        <div className="space-y-4">
          {results.map((repo) => (
            <RepoResultCard key={repo.id} repository={repo} />
          ))}
        </div>
      )}
    </div>
  );
};

// Ensure fadeIn animation is in globals.css

// Basic fade-in animation (add to globals.css if not already present)
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}
*/ 