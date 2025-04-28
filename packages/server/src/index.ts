import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js'; // Use .js extension for NodeNext compatibility
import { resolvers, MyContext } from './resolvers.js'; // Use .js extension

// Define the port, allowing for environment variable override
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

export async function startServer(): Promise<void> {
  // Required logic for integrating with Express
  // const app = express();
  // TODO: Add middleware (cors, body-parser) if needed when switching from standalone

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    // Add any Apollo Server options here (e.g., introspection: true in dev)
  });

  try {
    // `startStandaloneServer` sets up Apollo Server integration with a default Node.js HTTP server.
    const { url } = await startStandaloneServer(server, {
      // context: async ({ req }) => ({ token: req.headers.token }), // Example context setup
      listen: { port: PORT },
    });
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error('🚨 Error starting server:', error);
    process.exit(1); // Exit if server fails to start
  }
}

// Optional: Call startServer directly if this file is run as the main script
// This allows running `node dist/index.js` or `ts-node src/index.ts` directly
if (process.argv.some((arg) => arg.includes('index.ts') || arg.includes('index.js'))) {
  void startServer();
}
