import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Docs E2E', () => {
  let app: INestApplication;
  beforeAll(async () => {
    class MockPrisma {}
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useClass(MockPrisma as any)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => { await app.close(); });

  it('GET /openapi.json returns spec with info', async () => {
    const res = await request(app.getHttpServer()).get('/openapi.json').expect(200);
    expect(res.body?.openapi).toBeDefined();
    expect(res.body?.info?.title).toContain('Trello-like POC API');
    expect(res.body?.paths?.['/boards']).toBeDefined();
  });

  it('GET /docs returns HTML', async () => {
    const res = await request(app.getHttpServer()).get('/docs').expect(200);
    expect(res.text).toContain('<!doctype html>');
    expect(res.text).toContain('Redoc');
  });
});
