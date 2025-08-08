import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Lightweight e2e without real DB writes by stubbing Prisma methods
class MockPrismaService {
  board = {
    findMany: jest.fn(async () => [{ id: 'b1', title: 'Demo', lists: [] }]),
  } as any;
}

describe('App E2E', () => {
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

  it('/health (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.ok).toBe(true);
  });

  it('/boards (GET) returns list', async () => {
    const res = await request(app.getHttpServer()).get('/boards').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ id: 'b1', title: 'Demo' });
  });
});
