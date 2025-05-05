'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export const AuthControls = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p className="text-sm text-gray-500">Loading session...</p>;
  }

  if (status === 'unauthenticated') {
    return (
      <button 
        onClick={() => signIn('github')}
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Sign in with GitHub
      </button>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600 hidden sm:block"> 
          Signed in as {session.user?.name || session.user?.email}
        </p>
        {/* Basic avatar placeholder */}
        {session.user?.image && (
          <img src={session.user.image} alt="User Avatar" className="w-8 h-8 rounded-full" />
        )}
        <button 
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors text-sm"
        >
          Sign out
        </button>
      </div>
    );
  }

  return null; // Should not happen in normal flow
}; 