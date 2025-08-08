import { CardsService } from '../src/cards/cards.service';

describe('CardsService', () => {
  it('createCard assigns next position after max', async () => {
    const prisma: any = {
      card: {
        aggregate: jest.fn(async () => ({ _max: { position: 0 } })),
        create: jest.fn(async ({ data }: any) => ({ id: 'c1', ...data })),
      },
    };
    const svc = new CardsService(prisma);
    const out = await svc.createCard('l1', 'Card');
    expect(out).toMatchObject({ id: 'c1', position: 1, listId: 'l1' });
  });

  it('reorder moves across lists and repositions', async () => {
    const updates: any[] = [];
    const prisma: any = {
      card: { update: jest.fn((args: any) => ({ args })) },
      $transaction: jest.fn(async (ops: any[]) => { updates.push(...ops.map((o: any) => o.args)); return updates; }),
    };
    const svc = new CardsService(prisma);
    const out = await svc.reorder({
      source: { listId: 'l1', orderedIds: ['c2'] },
      dest: { listId: 'l2', orderedIds: ['c1', 'c3'] },
    });
    expect(prisma.$transaction).toHaveBeenCalled();
    // First, updates to set listId for dest ids, then positions for both lists
    expect(out).toEqual([
      { where: { id: 'c1' }, data: { listId: 'l2' } },
      { where: { id: 'c3' }, data: { listId: 'l2' } },
      { where: { id: 'c2' }, data: { position: 1, listId: 'l1' } },
      { where: { id: 'c1' }, data: { position: 1, listId: 'l2' } },
      { where: { id: 'c3' }, data: { position: 2, listId: 'l2' } },
    ]);
  });
});
