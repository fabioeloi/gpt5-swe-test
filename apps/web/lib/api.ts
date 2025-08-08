export async function fetchBoards() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  try {
    const res = await fetch(`${base}/boards`, { next: { revalidate: 0 } });
    if (!res.ok) return [] as any[];
    return (await res.json()) as any[];
  } catch (e) {
    console.error('fetchBoards error', e);
    return [] as any[];
  }
}

export async function fetchBoard(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  try {
    const res = await fetch(`${base}/boards/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as any;
  } catch (e) {
    console.error('fetchBoard error', id, e);
    return null;
  }
}
