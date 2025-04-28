import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions
import AuthButton from "./AuthButton"; // We will create this client component next
import Image from "next/image"; // Import Image for user avatar

// Simple placeholder Logo component
const Logo = () => (
  <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
    Pulseboard
  </Link>
);

// Make Header an async component to fetch session
export default async function Header() {
  // Fetch session data on the server
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-neutral-50 shadow-sm sticky top-0 z-10 border-b border-neutral-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center space-x-6">
          {/* Placeholder links */}
          <Link href="/" className="text-sm text-neutral-600 hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/stack" className="text-sm text-neutral-600 hover:text-primary transition-colors">
            Stack
          </Link>

          {/* Auth Section */}
          {session?.user ? (
            <div className="flex items-center space-x-3">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full border border-neutral-300"
                />
              )}
              <span className="text-sm text-neutral-700 hidden md:inline">
                {session.user.name || session.user.email}
              </span>
              {/* Sign Out Button (uses Client Component) */}
              <AuthButton action="signout" />
            </div>
          ) : (
            // Sign In Button (uses Client Component)
            <AuthButton action="signin" />
          )}
        </nav>
      </div>
    </header>
  );
} 