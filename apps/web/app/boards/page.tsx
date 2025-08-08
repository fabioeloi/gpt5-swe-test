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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Boards</h1>
        <form action={createBoard} className="flex items-center gap-2">
          <input name="title" placeholder="New board title" className="rounded border px-3 py-2 text-sm" />
          <button type="submit" className="rounded bg-brand-600 text-white px-3 py-2 text-sm hover:bg-brand-700">Create</button>
        </form>
      </div>
      {boards.length === 0 ? (
        <div className="text-slate-500">No boards yet. Create one above.</div>
      ) : (
        boards.map((b: any) => (
          <section key={b.id} className="space-y-3">
            <h2 className="text-lg font-medium">
              <a href={`/board/${b.id}`} className="hover:underline">{b.title}</a>
            </h2>
            <div className="board-grid">
              {b.lists?.map((l: any) => (
                <div key={l.id} className="board-column">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm">{l.title}</strong>
                    <button className="text-xs text-brand-700 hover:underline">+ Card</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {l.cards?.map((c: any) => (
                      <div key={c.id} className="board-card">
                        <div className="text-sm font-medium">{c.title}</div>
                        {c.description ? <div className="text-xs text-slate-600 mt-1 line-clamp-3">{c.description}</div> : null}
                      </div>
                    ))}
                  </div>
                  <button className="text-xs text-slate-500 hover:text-slate-700 self-start">Add another card</button>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
