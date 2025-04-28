import NextAuth from "next-auth";
// Remove imports related to provider/types, they are in the other file now
// import GithubProvider from "next-auth/providers/github";
// import type { AuthOptions } from "next-auth";
// import type { JWT } from "next-auth/jwt"; 
// import type { Session } from "next-auth"; 
// import type { Account } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Import from the new file

// Remove env checks and type declarations, they are in the other file

// Remove the config object definition
// export const authConfigObject: AuthOptions = { ... };

// Use the imported authOptions and the handler export pattern
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Remove the direct exports
// export const GET = NextAuth(authConfigObject);
// export const POST = NextAuth(authConfigObject); 