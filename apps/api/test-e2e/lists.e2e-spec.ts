import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Jest fns to control mock behavior
const listAggregate = jest.fn();
const listCreate = jest.fn();
const listUpdate = jest.fn();
const tx = jest.fn(async (ops: any[]) => Promise.all(ops));

class MockPrismaService {
  list = {
    aggregate: listAggregate,
    create: listCreate,
    update: listUpdate,
  } as any;
  $transaction = tx as any;
}

describe('Lists E2E', () => {
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

  it('/lists (POST) creates list with next position', async () => {
    listAggregate.mockResolvedValue({ _max: { position: 2 } });
    listCreate.mockResolvedValue({ id: 'l3', boardId: 'b1', title: 'New', position: 3 });

    const res = await request(app.getHttpServer())
      .post('/lists')
      .send({ boardId: 'b1', title: 'New' })
      .expect(201);

    expect(listAggregate).toHaveBeenCalledWith({ _max: { position: true }, where: { boardId: 'b1' } });
    expect(listCreate).toHaveBeenCalledWith({ data: { boardId: 'b1', title: 'New', position: 3 } });
    expect(res.body).toMatchObject({ id: 'l3', boardId: 'b1', title: 'New', position: 3 });
  });

  it('/lists/reorder (PATCH) reorders lists positions', async () => {
    // mock list.update to echo back id + new data
    listUpdate.mockImplementation(({ where, data }: any) => Promise.resolve({ id: where.id, ...data }));

    const res = await request(app.getHttpServer())
      .patch('/lists/reorder')
      .send({ boardId: 'b1', orderedIds: ['l2', 'l1'] })
      .expect(200);

    expect(listUpdate).toHaveBeenCalledTimes(2);
    expect(tx).toHaveBeenCalled();
    expect(res.body).toEqual([
      { id: 'l2', position: 1, boardId: 'b1' },
      { id: 'l1', position: 2, boardId: 'b1' },
    ]);
  });
});
