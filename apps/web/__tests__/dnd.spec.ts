import { reorderLists, reorderCards, Card, List } from '../lib/dnd';

describe('dnd helpers', () => {
  test('reorderLists moves and reindexes', () => {
    const lists: List[] = [
      { id: 'l1', title: 'One', position: 1, cards: [] },
      { id: 'l2', title: 'Two', position: 2, cards: [] },
      { id: 'l3', title: 'Three', position: 3, cards: [] },
    ];
    const res = reorderLists(lists, 'l1', 'l3');
    expect(res?.orderedIds).toEqual(['l2', 'l3', 'l1']);
    expect(res?.lists.map(l => l.position)).toEqual([1,2,3]);
  });

  test('reorderCards within same list', () => {
    const cards: Card[] = [
      { id: 'c1', title: 'A', position: 1, listId: 'l1' },
      { id: 'c2', title: 'B', position: 2, listId: 'l1' },
      { id: 'c3', title: 'C', position: 3, listId: 'l1' },
    ];
    const state = { l1: cards };
    const res = reorderCards(state, { sourceListId: 'l1', destListId: 'l1', activeCardId: 'c1', overId: 'c3' });
    expect(res?.source.orderedIds).toEqual(['c2','c3','c1']);
    expect(res?.cardsByList.l1.map(c=>c.position)).toEqual([1,2,3]);
  });

  test('reorderCards cross-list', () => {
    const state = {
      l1: [
        { id: 'c1', title: 'A', position: 1, listId: 'l1' },
        { id: 'c2', title: 'B', position: 2, listId: 'l1' },
      ],
      l2: [
        { id: 'c3', title: 'C', position: 1, listId: 'l2' },
      ],
    };
    const res = reorderCards(state, { sourceListId: 'l1', destListId: 'l2', activeCardId: 'c1', overId: 'c3' });
    expect(res?.source.orderedIds).toEqual(['c2']);
    expect(res?.dest?.orderedIds).toEqual(['c1','c3']);
    expect(res?.cardsByList.l2.map(c=>c.id)).toEqual(['c1','c3']);
  });
});
