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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {boards.map((b: any) => {
            const listCount = b.lists?.length || 0;
            const cardCount = (b.lists || []).reduce((acc: number, l: any) => acc + (l.cards?.length || 0), 0);
            return (
        <a key={b.id} href={`/board/${b.id}`} className="rounded-lg bg-white shadow-sm border border-slate-100 p-4 hover:shadow-md transition">
                <div className="text-sm text-slate-500">Board</div>
                <div className="mt-1 font-medium">{b.title}</div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-500" /> {listCount} lists</span>
          <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {cardCount} cards</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
