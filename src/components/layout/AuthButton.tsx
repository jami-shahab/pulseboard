"use client";

import React from "react";
import { signIn, signOut } from "next-auth/react";

interface AuthButtonProps {
  action: "signin" | "signout";
}

export default function AuthButton({ action }: AuthButtonProps) {
  if (action === "signin") {
    return (
      <button
        onClick={() => signIn("github")} // Trigger GitHub sign-in flow
        className="bg-primary text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm border border-primary-dark"
      >
        Login with GitHub
      </button>
    );
  }

  if (action === "signout") {
    return (
      <button
        onClick={() => signOut()} // Trigger sign-out flow
        className="bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-neutral-300 hover:text-neutral-800 transition-colors border border-neutral-300"
      >
        Sign Out
      </button>
    );
  }

  return null; // Should not happen with defined actions
} 