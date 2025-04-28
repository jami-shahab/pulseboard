import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Ensure environment variables are defined
const githubApiUrl = process.env.NEXT_PUBLIC_GITHUB_GRAPHQL_ENDPOINT;
const githubPat = process.env.GITHUB_PAT;

if (!githubApiUrl) {
  throw new Error(
    "Apollo Client Error: NEXT_PUBLIC_GITHUB_GRAPHQL_ENDPOINT environment variable is not set."
  );
}

if (!githubPat) {
  // This check mainly helps during development if the .env.local is missing/misconfigured.
  // In production builds, this variable should ideally always be present.
  console.warn(
    "Apollo Client Warning: GITHUB_PAT environment variable is not set. GitHub API requests will be unauthorized and subject to stricter rate limits."
  );
}

// Create an HTTP link to the GraphQL endpoint
const httpLink = createHttpLink({
  uri: githubApiUrl,
});

// Create an authentication link to add the Authorization header
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from the environment variable.
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // Only add the authorization header if the PAT exists
      authorization: githubPat ? `Bearer ${githubPat}` : "",
    },
  };
});

// Create the Apollo Client instance
const apolloClient = new ApolloClient({
  // Chain the auth link and http link
  link: authLink.concat(httpLink),
  // Use an in-memory cache for caching GraphQL results
  cache: new InMemoryCache(),
  // Optional: Configure default options (e.g., fetch policy) if needed
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: 'cache-and-network',
  //   },
  // },
});

export default apolloClient; 