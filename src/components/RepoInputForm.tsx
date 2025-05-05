'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";

interface RepoInputFormProps {
  onFetch: (owner: string, name: string) => void;
  isLoading: boolean;
}

export const RepoInputForm: React.FC<RepoInputFormProps> = ({ onFetch, isLoading }) => {
  const { status } = useSession();
  const [repoInput, setRepoInput] = useState('');
  // State for user feedback messages
  const [message, setMessage] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setMessage(null); // Clear previous messages

    if (!isAuthenticated) {
      setMessage('Please sign in with GitHub to fetch repository data.');
      return; // Stop processing if not authenticated
    }

    const [owner, name] = repoInput.trim().split('/');
    if (owner && name) {
      onFetch(owner, name);
    } else {
      setMessage('Please enter the repository in the format: owner/name');
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <input
          type="text"
          value={repoInput}
          onChange={(e) => {
            setRepoInput(e.target.value);
            if (message) setMessage(null); // Clear message on input change
          }}
          placeholder="owner/repository (e.g., facebook/react)"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400 w-full sm:w-auto text-gray-900"
          // Removed disabled prop - always enabled
          aria-label="Repository Input"
        />
        <button
          type="submit" 
          // Only disable when loading, not based on auth status
          disabled={isLoading}
          className="px-5 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isLoading ? 'Fetching...' : 'Fetch Data'}
        </button>
      </form>
      {/* Display message area below the form */} 
      {message && (
        <p className="text-sm text-red-600 mt-2">{message}</p>
      )}
    </div>
  );
}; 