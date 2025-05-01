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

  const handleAuth = () => {
    if (action === 'signin') {
      signIn('github'); // Specify GitHub provider
    } else {
      signOut();
    }
  };

  // Apply new theme styling
  const baseStyle = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const styles = action === 'signin'
    ? `${baseStyle} bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm hover:shadow-md` // Primary button style
    : `${baseStyle} bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus:ring-neutral-400`; // Secondary/logout button style

  if (action === 'signout' && session) {
    return (
      <button onClick={handleAuth} className={styles}>
        Sign Out
      </button>
    );
  }

  // Render nothing if action is 'signout' but there's no session, or if action is invalid
  return null; 
} 