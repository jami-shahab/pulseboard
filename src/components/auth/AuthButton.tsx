'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthButtonProps {
  action: 'signin' | 'signout';
}

export default function AuthButton({ action }: AuthButtonProps) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  if (isLoading) {
    // Optional: Render a loading state or null
    return (
      <button className="px-4 py-2 text-sm font-medium text-white bg-neutral-400 rounded-md focus:outline-none cursor-not-allowed" disabled>
        ...
      </button>
    );
  }

  if (action === 'signin') {
    return (
      <button
        onClick={() => signIn('github')} // Specify GitHub provider
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
      >
        Login with GitHub
      </button>
    );
  }

  if (action === 'signout' && session) {
    return (
      <button
        onClick={() => signOut()} // Default signOut redirects
        className="px-3 py-1.5 text-sm font-medium text-neutral-700 bg-neutral-200 rounded-md hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-400 transition-colors"
      >
        Sign Out
      </button>
    );
  }

  // Render nothing if action is 'signout' but there's no session, or if action is invalid
  return null; 
} 