"use client";
import React from 'react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';

type Card = { id: string; title: string; description?: string; position: number; listId: string };
type List = { id: string; title: string; position: number; cards: Card[] };
type Board = { id: string; title: string; lists: List[] };

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function BoardView({ initialBoard }: { initialBoard: Board }) {
  const router = useRouter();
  const [lists, setLists] = React.useState<List[]>(
    [...(initialBoard.lists || [])].sort((a, b) => a.position - b.position),
  );
  const [cardsByList, setCardsByList] = React.useState<Record<string, Card[]>>(() => {
    const out: Record<string, Card[]> = {};
    for (const l of lists) {
      out[l.id] = [...(l.cards || [])].sort((a, b) => a.position - b.position);
    }
    return out;
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor),
  );

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  async function addList(formData: FormData) {
    const title = String(formData.get('title') || '').trim();
    if (!title) return;
    await fetch(`${base}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId: initialBoard.id, title }),
    });
    router.refresh();
  }

  async function addCard(listId: string, formData: FormData) {
    const title = String(formData.get('title') || '').trim();
    if (!title) return;
    await fetch(`${base}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listId, title }),
    });
    router.refresh();
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const aid = String(active.id);
    const oid = String(over.id);

    // Dragging a list (column)
    const listIds = lists.map((l) => l.id);
    if (listIds.includes(aid) && listIds.includes(oid)) {
      const oldIndex = listIds.indexOf(aid);
      const newIndex = listIds.indexOf(oid);
      const next = arrayMove(lists, oldIndex, newIndex);
      setLists(next);
      const orderedIds = next.map((l) => l.id);
      fetch(`${base}/lists/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: initialBoard.id, orderedIds }),
      }).then(() => router.refresh());
      return;
    }

    // Dragging a card
    // Determine source and destination lists by scanning cardsByList
    let sourceListId: string | null = null;
    let destListId: string | null = null;
    for (const [lid, cards] of Object.entries(cardsByList)) {
      if (cards.find((c) => c.id === aid)) sourceListId = lid;
      if (cards.find((c) => c.id === oid)) destListId = lid;
    }
    if (!sourceListId) return;
    // If dropping on a list header area, allow moving to end
    if (!destListId && lists.find((l) => l.id === oid)) destListId = oid;
    if (!destListId) return;

    const sourceCards = [...(cardsByList[sourceListId] || [])];
    const destCards = sourceListId === destListId ? sourceCards : [...(cardsByList[destListId] || [])];
    const fromIndex = sourceCards.findIndex((c) => c.id === aid);
    const toIndex = destCards.findIndex((c) => c.id === oid);

    if (fromIndex < 0) return;

    let nextSource = sourceCards;
    let nextDest = destCards;

    const [moved] = nextSource.splice(fromIndex, 1);
    if (sourceListId === destListId) {
      // Reorder within same list
      nextDest = arrayMove(nextDest, fromIndex, Math.max(0, toIndex));
      setCardsByList({ ...cardsByList, [sourceListId]: nextDest });
      fetch(`${base}/cards/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: { listId: sourceListId, orderedIds: nextDest.map((c) => c.id) },
        }),
      }).then(() => router.refresh());
    } else {
      // Move across lists
      const insertIndex = toIndex >= 0 ? toIndex : nextDest.length;
      nextDest.splice(insertIndex, 0, { ...moved, listId: destListId });
      setCardsByList({ ...cardsByList, [sourceListId]: nextSource, [destListId]: nextDest });
      fetch(`${base}/cards/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: { listId: sourceListId, orderedIds: nextSource.map((c) => c.id) },
          dest: { listId: destListId, orderedIds: nextDest.map((c) => c.id) },
        }),
      }).then(() => router.refresh());
    }
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={lists.map((l) => l.id)} strategy={rectSortingStrategy}>
          <div className="board-grid">
            {lists.map((l) => (
              <SortableItem id={l.id} key={l.id}>
                <div className="board-column">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm">{l.title}</strong>
                  </div>
                  <SortableContext items={(cardsByList[l.id] || []).map((c) => c.id)} strategy={rectSortingStrategy}>
                    <div className="flex flex-col gap-2">
                      {(cardsByList[l.id] || []).map((c) => (
                        <SortableItem id={c.id} key={c.id}>
                          <div className="board-card">
                            <div className="text-sm font-medium">{c.title}</div>
                            {c.description ? (
                              <div className="text-xs text-slate-600 mt-1 line-clamp-3">{c.description}</div>
                            ) : null}
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      await addCard(l.id, fd);
                      (e.currentTarget as HTMLFormElement).reset();
                    }}
                    className="mt-2 flex gap-2"
                  >
                    <input name="title" placeholder="Add a card" className="rounded border px-2 py-1 text-xs" />
                    <button type="submit" className="text-xs rounded bg-slate-900 text-white px-2 py-1">Add</button>
                  </form>
                </div>
              </SortableItem>
            ))}
            <div className="board-column">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  await addList(fd);
                  (e.currentTarget as HTMLFormElement).reset();
                }}
                className="flex gap-2"
              >
                <input name="title" placeholder="Add a list" className="rounded border px-2 py-1 text-xs" />
                <button type="submit" className="text-xs rounded bg-brand-600 text-white px-2 py-1">Add list</button>
              </form>
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
