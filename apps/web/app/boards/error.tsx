"use client";
import React from 'react';

export default function BoardsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    // Log error to client console for quick triage; server logs already record it
    // eslint-disable-next-line no-console
    console.error('Boards page error', error);
  }, [error]);
  return (
    <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <div className="font-medium">Something went wrong loading boards.</div>
      <div className="mt-1 text-xs opacity-80 break-all">{error.message}</div>
      <button onClick={() => reset()} className="mt-3 inline-flex items-center rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700">
        Try again
      </button>
    </div>
  );
}
