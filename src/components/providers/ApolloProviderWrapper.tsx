// Mark this component as a Client Component
"use client";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo/client"; // Using the alias we configured
import React from "react";

interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

export default function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
} 