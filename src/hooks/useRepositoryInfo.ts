import { useLazyQuery } from '@apollo/client';
import { GET_REPOSITORY_INFO } from '@/graphql/queries/repository.gql';

// Define types for the query variables and data if desired (optional but recommended)
// You could generate these using GraphQL Code Generator
interface RepositoryInfoVars {
  owner: string;
  name: string;
}

// Add more specific types based on your query structure
interface RepositoryInfoData {
  repository: {
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
  } | null;
}

export const useRepositoryInfo = () => {
  const [fetchRepoInfo, { loading, error, data }] = useLazyQuery<RepositoryInfoData, RepositoryInfoVars>(
      GET_REPOSITORY_INFO
  );

  return {
      fetchRepoInfo,
      loading,
      error,
      repositoryData: data?.repository // Return the nested data directly
  };
}; 