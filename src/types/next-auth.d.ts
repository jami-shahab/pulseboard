import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      // Add other user properties if needed, like id
    } & DefaultSession["user"];
  }

  // If you need to add properties to the User model itself
  // interface User extends DefaultUser {
  //   id: string;
  // }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** GitHub OAuth access token */
    accessToken?: string;
  }
} 