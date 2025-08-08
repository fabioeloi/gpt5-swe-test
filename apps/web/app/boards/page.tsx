async function fetchBoards() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const res = await fetch(`${base}/boards`, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function BoardsPage() {
  const boards = await fetchBoards();
  return (
    <main style={{ padding: 24 }}>
      <h1>Boards</h1>
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
