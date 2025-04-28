import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import type { AuthOptions } from "next-auth"; // Import AuthOptions type

// Ensure environment variables are available
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!githubClientId || !githubClientSecret) {
  throw new Error(
    "Missing GitHub OAuth environment variables (GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET)"
  );
}

if (!nextAuthSecret) {
  // In production, this should always be set. In development, NextAuth might generate one,
  // but it's best practice to set it explicitly for consistency and security.
  console.warn(
    "Warning: NEXTAUTH_SECRET environment variable is not set. Session cookies will not be secure."
  );
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing NEXTAUTH_SECRET environment variable in production.");
  }
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      // Request specific scopes needed later for private repo access
      // For now, default scopes are usually fine for basic login
      // scope: "repo read:user user:email",
    }),
    // ...add more providers here if needed
  ],
  // The secret is used to sign cookies and tokens
  secret: nextAuthSecret,
  // Optional: Add callbacks for customizing behavior (e.g., saving tokens)
  // callbacks: {
  //   async jwt({ token, account }) {
  //     // Persist the OAuth access_token to the token right after signin
  //     if (account) {
  //       token.accessToken = account.access_token;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     // Send properties to the client, like an access_token
  //     session.accessToken = token.accessToken;
  //     return session;
  //   },
  // },
  // Optional: Add custom pages if needed
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for email/passwordless login)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  // }
};

// Export the handlers for GET and POST requests
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 