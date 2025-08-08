async function fetchBoards() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const res = await fetch(`${base}/boards`, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function BoardsPage() {
  const { revalidatePath } = await import('next/cache');
  async function createBoard(formData: FormData) {
    'use server';
    const title = String(formData.get('title') || '').trim();
    if (!title) return;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${base}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
        cache: 'no-store',
      });
      if (!res.ok) {
        // swallow error for POC and continue to refresh
        console.error('Create board failed', await res.text());
      }
    } catch (e) {
      console.error('Create board error', e);
    }
  revalidatePath('/boards');
  }
  const boards = await fetchBoards();
  return (
    <main style={{ padding: 24 }}>
      <h1>Boards</h1>
      <form action={createBoard} style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <input name="title" placeholder="New board title" />
        <button type="submit">Create</button>
      </form>
      {boards.length === 0 ? (
        <p>No boards yet. Run seed.</p>
      ) : (
        boards.map((b: any) => (
          <section key={b.id} style={{ margin: '16px 0' }}>
            <h2>{b.title}</h2>
            <div style={{ display: 'flex', gap: 12 }}>
              {b.lists?.map((l: any) => (
                <div key={l.id} style={{ padding: 8, background: '#f7f7f7' }}>
                  <strong>{l.title}</strong>
                  <ul>
                    {l.cards?.map((c: any) => (
                      <li key={c.id}>{c.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
