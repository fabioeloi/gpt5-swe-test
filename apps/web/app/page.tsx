import Health from './ui/Health';

export default function HomePage() {
  return (
    <main style={{ padding: 24, display: 'grid', gap: 12 }}>
      <h1>GPT5 Trello-like POC</h1>
      <p>Next.js app skeleton is running. API and DB to follow.</p>
      <Health />
    </main>
  );
}
