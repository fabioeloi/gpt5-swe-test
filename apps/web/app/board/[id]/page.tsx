import { notFound } from 'next/navigation';
import { fetchBoard } from '../../../lib/api';

import BoardView from './BoardView';

export default async function BoardPage({ params }: { params: { id: string } }) {
  const board = await fetchBoard(params.id);
  if (!board) return notFound();
  return <BoardView initialBoard={board} />;
}
