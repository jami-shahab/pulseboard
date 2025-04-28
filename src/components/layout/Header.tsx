import Link from "next/link";
import React from "react";

// Simple placeholder Logo component
const Logo = () => (
  <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
    Pulseboard
  </Link>
);

// Simple placeholder Nav component
const Nav = () => (
  <nav className="flex space-x-4">
    {/* Placeholder links - will expand later */}
    <Link href="/" className="text-neutral-600 hover:text-primary transition-colors">
      Dashboard
    </Link>
    <Link href="/about" className="text-neutral-600 hover:text-primary transition-colors">
      About
    </Link>
    {/* Placeholder for Auth Button */}
    <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
      Login
    </button>
  </nav>
);

export default function Header() {
  return (
    <header className="bg-neutral-50 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        <Nav />
      </div>
    </header>
  );
} 