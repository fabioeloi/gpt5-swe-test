import { notFound } from 'next/navigation';

async function fetchBoard(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const res = await fetch(`${base}/boards/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

import BoardView from './BoardView';

export default async function BoardPage({ params }: { params: { id: string } }) {
  const board = await fetchBoard(params.id);
  if (!board) return notFound();
  return <BoardView initialBoard={board} />;
}
