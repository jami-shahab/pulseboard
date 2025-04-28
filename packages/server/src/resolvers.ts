import { Resolvers } from './generated/graphql'; // Assuming codegen later

// Define a type for the context (optional for now, but good practice)
export interface MyContext {
  // context properties if needed, e.g., token: string;
}

// Use a more specific type for resolvers if available (e.g., from codegen)
// For now, using a basic structure.
export const resolvers: Resolvers = { // Replace 'Resolvers' if not using codegen yet
  Query: {
    _ping: (): string => {
      // Simple resolver returning "pong"
      return 'pong';
    },
  },
  // Add Mutation, Subscription resolvers here if needed
};

// Temporary placeholder type if not using codegen yet
// Replace with actual generated type when available
type Resolvers = {
  Query?: {
    _ping?: () => string;
  };
  // ... other resolver types
}; 