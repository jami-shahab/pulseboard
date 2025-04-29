import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session/user types from NextAuth to include the properties
   * you added to the jwt and session callbacks.
   */
  interface Session {
    accessToken?: string; // Add the accessToken property
    user?: {
      id?: string | null; // Example: Add custom user properties if needed
    } & DefaultSession["user"];
  }

  // If you also added accessToken to the JWT, augment the JWT interface too
  interface JWT {
     accessToken?: string;
  }
} 