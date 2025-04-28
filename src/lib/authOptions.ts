import GithubProvider from "next-auth/providers/github";
import type { AuthOptions } from "next-auth";

// Ensure environment variables are available
// (These are still needed here as the object is defined here)
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!githubClientId || !githubClientSecret) {
  throw new Error(
    "Missing GitHub OAuth environment variables (GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET)"
  );
}

if (!nextAuthSecret) {
  console.warn(
    "Warning: NEXTAUTH_SECRET environment variable is not set. Session cookies will not be secure."
  );
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing NEXTAUTH_SECRET environment variable in production.");
  }
}

// Define and export the AuthOptions object
export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      authorization: {
        params: { scope: "repo read:user user:email" },
      },
    }),
  ],
  secret: nextAuthSecret,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // We need to declare the types properly here or use // @ts-ignore if lazy
      // For now, assuming types match the declaration in route.ts (which we'll remove)
      // @ts-ignore
      session.accessToken = token.accessToken;
      return session;
    },
  },
  // pages: { ... }
}; 