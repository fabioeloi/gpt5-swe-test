import { BoardsService } from '../src/boards/boards.service';

describe('BoardsService', () => {
  it('createBoard creates a demo user if none exists', async () => {
    const prisma: any = {
      user: {
        findFirst: jest.fn(async () => null),
        upsert: jest.fn(async () => ({ id: 'demo' })),
      },
      board: { create: jest.fn(async ({ data }: any) => ({ id: 'b1', ...data })) },
    };
    const svc = new BoardsService(prisma);
    const out = await svc.createBoard('Hello');
    expect(prisma.user.findFirst).toHaveBeenCalled();
    expect(prisma.user.upsert).toHaveBeenCalled();
    expect(out).toMatchObject({ id: 'b1', title: 'Hello', ownerId: 'demo' });
  });
});
