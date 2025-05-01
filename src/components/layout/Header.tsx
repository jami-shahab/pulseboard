import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Import authOptions
import AuthButton from "@/components/auth/AuthButton"; // We will create this client component next
import Image from "next/image"; // Import Image for user avatar

// Simple placeholder Logo component
const Logo = () => (
  <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors">
    Pulseboard
  </Link>
);

// Make Header an async component to fetch session
export default async function Header() {
  // Fetch session data on the server
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-card shadow-subtle sticky top-0 z-40 border-b border-border">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center space-x-6">
          {/* Style nav links */}
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/stack" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Stack
          </Link>

          {/* Auth Section Styling */}
          {session?.user ? (
            <div className="flex items-center space-x-4">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={36} // Slightly larger avatar
                  height={36}
                  className="rounded-full border-2 border-primary-light"
                />
              )}
              <span className="text-sm font-medium text-foreground hidden md:inline">
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