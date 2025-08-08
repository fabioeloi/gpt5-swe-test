import { ListsService } from '../src/lists/lists.service';

describe('ListsService', () => {
  it('createList assigns next position after max', async () => {
    const prisma: any = {
      list: {
        aggregate: jest.fn(async () => ({ _max: { position: 3 } })),
        create: jest.fn(async ({ data }: any) => ({ id: 'l4', ...data })),
      },
    };
    const svc = new ListsService(prisma);
    const out = await svc.createList('b1', 'New List');
    expect(prisma.list.aggregate).toHaveBeenCalledWith({ _max: { position: true }, where: { boardId: 'b1' } });
    expect(out).toMatchObject({ position: 4, title: 'New List', boardId: 'b1' });
  });

  it('reorder updates positions in order', async () => {
    const updates: any[] = [];
    const prisma: any = {
      list: { update: jest.fn((args: any) => ({ args })) },
      $transaction: jest.fn(async (ops: any[]) => { updates.push(...ops.map((o: any) => o.args)); return updates; }),
    };
    const svc = new ListsService(prisma);
    const out = await svc.reorder('b1', ['l2', 'l1', 'l3']);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(out).toEqual([
      { where: { id: 'l2' }, data: { position: 1, boardId: 'b1' } },
      { where: { id: 'l1' }, data: { position: 2, boardId: 'b1' } },
      { where: { id: 'l3' }, data: { position: 3, boardId: 'b1' } },
    ]);
  });
});
