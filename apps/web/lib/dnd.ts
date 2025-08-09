// Pure helper utilities for BoardView drag logic to enable unit testing.
// These functions accept plain data structures and return updated structures
// without performing any network calls or React state updates.

export type Card = { id: string; title: string; description?: string; position: number; listId: string };
export type List = { id: string; title: string; position: number; cards: Card[] };

export interface ReorderListsResult {
  lists: List[];
  orderedIds: string[];
}

export function reorderLists(lists: List[], activeId: string, overId: string): ReorderListsResult | null {
  const ids = lists.map(l => l.id);
  const oldIndex = ids.indexOf(activeId);
  const newIndex = ids.indexOf(overId);
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return null;
  const next = [...lists];
  const [moved] = next.splice(oldIndex, 1);
  next.splice(newIndex, 0, moved);
  return { lists: next.map((l, i) => ({ ...l, position: i + 1 })), orderedIds: next.map(l => l.id) };
}

export interface ReorderCardsPayload {
  sourceListId: string;
  destListId: string;
  activeCardId: string;
  overId: string; // could be listId (drop on empty or header) or another card id
}

export interface ReorderCardsResult {
  cardsByList: Record<string, Card[]>;
  source: { listId: string; orderedIds: string[] };
  dest?: { listId: string; orderedIds: string[] };
}

export function reorderCards(
  cardsByList: Record<string, Card[]>,
  payload: ReorderCardsPayload
): ReorderCardsResult | null {
  const { sourceListId, destListId, activeCardId, overId } = payload;
  const sourceCards = [...(cardsByList[sourceListId] || [])].sort((a,b)=>a.position-b.position);
  if (!sourceCards.find(c => c.id === activeCardId)) return null;
  const sameList = sourceListId === destListId;
  const destCards = sameList ? sourceCards : [...(cardsByList[destListId] || [])].sort((a,b)=>a.position-b.position);

  const fromIndex = sourceCards.findIndex(c => c.id === activeCardId);
  const toIndexCard = destCards.findIndex(c => c.id === overId);
  const insertIndex = toIndexCard >= 0 ? toIndexCard : destCards.length;
  const [moved] = sourceCards.splice(fromIndex, 1);

  if (sameList) {
    // reinsert within same list
    const reordered = [...sourceCards];
    reordered.splice(insertIndex, 0, moved);
    const positioned = reordered.map((c,i)=> ({ ...c, position: i + 1 }));
    return {
      cardsByList: { ...cardsByList, [sourceListId]: positioned },
      source: { listId: sourceListId, orderedIds: positioned.map(c=>c.id) }
    };
  }

  // cross-list
  const nextSource = sourceCards.map((c,i)=> ({ ...c, position: i + 1 }));
  const nextDest = [...destCards];
  nextDest.splice(insertIndex, 0, { ...moved, listId: destListId });
  const positionedDest = nextDest.map((c,i)=> ({ ...c, position: i + 1 }));
  return {
    cardsByList: { ...cardsByList, [sourceListId]: nextSource, [destListId]: positionedDest },
    source: { listId: sourceListId, orderedIds: nextSource.map(c=>c.id) },
    dest: { listId: destListId, orderedIds: positionedDest.map(c=>c.id) }
  };
}
