import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

class MockPrismaService {}

describe('Validation E2E', () => {
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

  it('POST /boards without title returns 400', async () => {
    const res = await request(app.getHttpServer()).post('/boards').send({}).expect(400);
    expect(res.body.message).toContain('title is required');
  });

  it('POST /lists without required fields returns 400', async () => {
    const res = await request(app.getHttpServer()).post('/lists').send({}).expect(400);
    expect(res.body.message).toContain('boardId and title are required');
  });

  it('PATCH /lists/reorder without orderedIds returns 400', async () => {
    const res = await request(app.getHttpServer()).patch('/lists/reorder').send({ boardId: 'b1' }).expect(400);
    expect(res.body.message).toContain('boardId and orderedIds are required');
  });

  it('POST /cards without required fields returns 400', async () => {
    const res = await request(app.getHttpServer()).post('/cards').send({}).expect(400);
    expect(res.body.message).toContain('listId and title are required');
  });

  it('POST /cards/reorder without source fields returns 400', async () => {
    const res = await request(app.getHttpServer()).post('/cards/reorder').send({}).expect(400);
    expect(res.body.message).toContain('source.listId and source.orderedIds are required');
  });
});
