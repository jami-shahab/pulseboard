'use client'; // This component needs to be a client component

import React, { useMemo } from 'react';
import { SessionProvider, useSession } from "next-auth/react";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Keep Apollo Client creation logic within the provider for encapsulation
const createApolloClient = (token: string | undefined) => {
  const httpLink = createHttpLink({
    uri: "https://api.github.com/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

// ApolloWrapper component: Creates/memoizes client based on session token
const ApolloWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken; // Use the typed accessToken

  // Memoize the client instance.
  // It will only be recreated if the accessToken changes.
  const client = useMemo(() => createApolloClient(accessToken), [accessToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

// Main Providers component
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* Wrap ApolloWrapper inside SessionProvider to access useSession */}
      <ApolloWrapper>{children}</ApolloWrapper>
    </SessionProvider>
  );
} 