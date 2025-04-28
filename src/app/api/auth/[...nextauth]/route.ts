import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import type { AuthOptions } from "next-auth"; // Import AuthOptions type
import type { JWT } from "next-auth/jwt"; // Import JWT type
import type { Session } from "next-auth"; // Import Session type
import type { Account } from "next-auth"; // Import Account type

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

// Extend Session and JWT types to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      // Request scopes needed for private repo access and user info
      authorization: {
        params: { scope: "repo read:user user:email" }, // Added 'repo' scope
      },
    }),
    // ...add more providers here if needed
  ],
  // The secret is used to sign cookies and tokens
  secret: nextAuthSecret,
  // Callbacks to control session and JWT content
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    async jwt({ token, account }: { token: JWT; account: Account | null }): Promise<JWT> {
      // Persist the OAuth access_token to the token right after signin
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // This callback is called whenever a session is checked.
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      // Send the accessToken property to the client session
      session.accessToken = token.accessToken;
      return session;
    },
  },
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