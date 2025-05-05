'use client';

import { useState, useEffect } from 'react';
import { useRepositoryInfo } from '@/hooks/useRepositoryInfo';
import { AuthControls } from '@/components/AuthControls';
import { RepoInputForm } from '@/components/RepoInputForm';
import { RepoResultsList } from '@/components/RepoInfoDisplay';

// Define the type for a single repository item - assuming RepoData is defined in RepoInfoDisplay or a shared types file
// If RepoData is not exported from RepoInfoDisplay, it should be moved to a shared types file.
// For now, let's redefine it here or assume it's importable (best practice is a shared file)
type RepoData = NonNullable<ReturnType<typeof useRepositoryInfo>['repositoryData']>;

// Define the maximum number of results to keep
const MAX_RESULTS = 5; 

export default function Home() {
  // Use the custom hook for data fetching logic for the *latest* fetch
  const { fetchRepoInfo, loading, error, repositoryData: latestRepositoryData } = useRepositoryInfo();
  
  // State to hold the list of fetched repository results
  const [results, setResults] = useState<RepoData[]>([]);

  // Callback for the form component to initiate fetch
  const handleFetch = (owner: string, name: string) => {
    // Optional: Check if already fetched to prevent duplicates - maybe check in useEffect
    fetchRepoInfo({ variables: { owner, name } });
  };

  // Effect to add the latest fetched data to the results array
  useEffect(() => {
    if (latestRepositoryData) {
      setResults(prevResults => {
        // Remove the existing entry if it's already there
        const filteredResults = prevResults.filter(r => r.id !== latestRepositoryData.id);
        
        // Add the latest result to the beginning
        const newResults = [latestRepositoryData, ...filteredResults];
        
        // Enforce the maximum number of results
        if (newResults.length > MAX_RESULTS) {
          return newResults.slice(0, MAX_RESULTS); // Keep only the first MAX_RESULTS items
        }
        
        return newResults;
      });
    }
  }, [latestRepositoryData]); // Depend only on latestRepositoryData

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 bg-animated-gradient">
      <div className="w-full max-w-5xl bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-violet-600">Pulseboard</h1>
          <AuthControls />
        </div>

        {/* Input Form Section */}
        <RepoInputForm onFetch={handleFetch} isLoading={loading} />

        {/* Display Section - Needs refactoring to show list */}
        {/* Pass results array, latest error, and loading state */}
        <RepoResultsList 
          results={results}
          error={error}
          loading={loading}
        />
      </div>
    </main>
  );
}
