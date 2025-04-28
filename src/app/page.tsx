"use client";

import { gql, useQuery } from "@apollo/client";

// Define the GraphQL query
const GET_REPO_INFO = gql`
  query GetRepositoryInfo($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      nameWithOwner
      description
      stargazerCount
      forkCount
      pushedAt
    }
  }
`;

export default function Home() {
  // Fetch data using the useQuery hook
  const { loading, error, data } = useQuery(GET_REPO_INFO, {
    variables: { owner: "facebook", name: "react" }, // Example: Fetch facebook/react
  });

  return (
    <div className="container mx-auto py-10 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-2 text-neutral-800">
        Welcome to Pulseboard
      </h1>
      <p className="text-lg text-center text-neutral-600 mb-12">
        Monitoring the heartbeat of Open Source, in real-time.
      </p>

      {/* Styled Data Card */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl border border-neutral-200">
        <div className="p-8">
          <h2 className="uppercase tracking-wide text-sm text-primary font-semibold mb-1">
            Example Repo Data (facebook/react)
          </h2>
          {loading && <p className="text-neutral-500 animate-pulse">Loading repository data...</p>}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
              <p className="text-sm font-medium text-secondary-dark">
                Error Fetching Data
              </p>
              <p className="text-sm text-secondary-dark mt-1">{error.message}</p>
            </div>
          )}
          {data && data.repository && (
            <div className="animate-bubble-pop">
              <p className="block mt-1 text-xl leading-tight font-semibold text-neutral-800">
                {data.repository.nameWithOwner}
              </p>
              <p className="mt-2 text-neutral-600">{data.repository.description}</p>
              <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-wrap justify-between gap-4 text-sm text-neutral-500">
                <span>⭐ {data.repository.stargazerCount.toLocaleString()} stars</span>
                <span>🍴 {data.repository.forkCount.toLocaleString()} forks</span>
                <span>
                  Last updated:{" "}
                  {new Date(data.repository.pushedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
