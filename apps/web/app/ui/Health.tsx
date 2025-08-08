'use client';

import { useEffect, useState } from 'react';

export default function Health() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    fetch(`${base}/health`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <div>API health error: {error}</div>;
  if (!data) return <div>Checking API health…</div>;
  return <pre style={{ background: '#f5f5f5', padding: 8 }}>{JSON.stringify(data, null, 2)}</pre>;
}
