import React from 'react';

// Re-use or import the RepoData type from a shared location
// Assuming it's defined as previously in RepoInfoDisplay or useRepositoryInfo
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

interface RepoResultCardProps {
  repository: RepoData;
}

export const RepoResultCard: React.FC<RepoResultCardProps> = ({ repository }) => {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-slate-50 animate-fadeIn shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-indigo-700">
        <a href={repository.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {repository.name}
        </a>
      </h2>
      <p className="text-gray-700 mb-4 text-sm">{repository.description || 'No description available.'}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-lg sm:text-xl font-bold text-violet-600">{repository.stargazerCount.toLocaleString()}</p>
          <p className="text-xs sm:text-sm text-gray-500">Stars</p>
        </div>
        <div>
          <p className="text-lg sm:text-xl font-bold text-violet-600">{repository.forkCount.toLocaleString()}</p>
          <p className="text-xs sm:text-sm text-gray-500">Forks</p>
        </div>
        <div>
          <p className="text-lg sm:text-xl font-bold text-violet-600">{repository.openIssues.totalCount.toLocaleString()}</p>
          <p className="text-xs sm:text-sm text-gray-500">Open Issues</p>
        </div>
        <div>
          <p className="text-lg sm:text-xl font-bold text-violet-600">{repository.defaultBranchRef?.target?.history?.totalCount?.toLocaleString() ?? 'N/A'}</p>
          <p className="text-xs sm:text-sm text-gray-500">Total Commits</p>
        </div>
      </div>
      {/* Add placeholders for more complex stats/charts here within the card if needed */}
    </div>
  );
}; 