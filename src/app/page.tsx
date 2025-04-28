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
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Pulseboard
      </h1>
      <p className="text-lg text-center text-gray-600 mb-10">
        Monitoring the heartbeat of Open Source, in real-time.
      </p>

      {/* Display fetched data */}
      <div className="mt-10 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <h2 className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
            Example Repo Data (facebook/react)
          </h2>
          {loading && <p className="text-gray-500">Loading repository data...</p>}
          {error && (
            <p className="text-red-600">
              Error fetching data: {error.message}
            </p>
          )}
          {data && data.repository && (
            <div>
              <p className="block mt-1 text-lg leading-tight font-medium text-black">
                {data.repository.nameWithOwner}
              </p>
              <p className="mt-2 text-gray-500">{data.repository.description}</p>
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>⭐ {data.repository.stargazerCount.toLocaleString()} stars</span>
                <span>🍴 {data.repository.forkCount.toLocaleString()} forks</span>
                <span>
                   viimeksi päivitetty:{" "}
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
