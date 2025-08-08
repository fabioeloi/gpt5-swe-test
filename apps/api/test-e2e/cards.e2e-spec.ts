import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const cardAggregate = jest.fn();
const cardCreate = jest.fn();
const cardUpdate = jest.fn();
const tx = jest.fn(async (ops: any[]) => Promise.all(ops));

class MockPrismaService {
  card = {
    aggregate: cardAggregate,
    create: cardCreate,
    update: cardUpdate,
  } as any;
  $transaction = tx as any;
}

describe('Cards E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useClass(MockPrismaService as any)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/cards (POST) creates card with next position', async () => {
    cardAggregate.mockResolvedValue({ _max: { position: 5 } });
    cardCreate.mockResolvedValue({ id: 'c6', listId: 'l1', title: 'New Card', position: 6 });

    const res = await request(app.getHttpServer())
      .post('/cards')
      .send({ listId: 'l1', title: 'New Card' })
      .expect(201);

    expect(cardAggregate).toHaveBeenCalledWith({ _max: { position: true }, where: { listId: 'l1' } });
    expect(cardCreate).toHaveBeenCalledWith({ data: { listId: 'l1', title: 'New Card', description: undefined, position: 6 } });
    expect(res.body).toMatchObject({ id: 'c6', listId: 'l1', title: 'New Card', position: 6 });
  });

  it('/cards/reorder (POST) moves cards across lists and repositions', async () => {
    // For cross-list move from l1 -> l2
    cardUpdate.mockImplementation(({ where, data }: any) => Promise.resolve({ id: where.id, ...data }));

    const res = await request(app.getHttpServer())
      .post('/cards/reorder')
      .send({
        source: { listId: 'l1', orderedIds: ['c2', 'c1'] },
        dest: { listId: 'l2', orderedIds: ['c3', 'c4'] },
      })
      .expect(201);

    // Should update listId for dest.orderedIds and then positions for both lists
    expect(cardUpdate).toHaveBeenCalled();
    expect(tx).toHaveBeenCalled();
    expect(res.body).toEqual([
      // dest listId normalization comes first in service
      { id: 'c3', listId: 'l2' },
      { id: 'c4', listId: 'l2' },
      // then source positions
      { id: 'c2', position: 1, listId: 'l1' },
      { id: 'c1', position: 2, listId: 'l1' },
      // then dest positions
      { id: 'c3', position: 1, listId: 'l2' },
      { id: 'c4', position: 2, listId: 'l2' },
    ]);
  });
});
