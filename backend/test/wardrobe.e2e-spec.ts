import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import type { Garment } from '../src/generated/prisma/client';

/**
 * Requires the local Postgres from docker-compose.yml to be running with
 * migrations applied: `docker compose up -d && npx prisma migrate dev`.
 */
describe('WardrobeController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const createdIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.garment.deleteMany({ where: { id: { in: createdIds } } });
    }
    await app.close();
  });

  it('uploads a garment photo and persists the analyzed garment', async () => {
    const response = await request(app.getHttpServer())
      .post('/wardrobe')
      .attach('image', Buffer.from('fake-image-bytes'), {
        filename: 'shirt.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);

    const garment: Garment = response.body;

    expect(garment).toMatchObject({
      type: expect.any(String),
      colors: expect.any(Array),
      style: expect.any(String),
      occasions: expect.any(Array),
      pattern: expect.any(String),
      estimatedMaterial: expect.any(String),
      description: expect.any(String),
    });
    // `embedding` is intentionally absent from the Garment type (see
    // prisma/schema.prisma) — confirms the API response never leaks it.
    expect(
      (garment as unknown as Record<string, unknown>).embedding,
    ).toBeUndefined();
    createdIds.push(garment.id);

    await request(app.getHttpServer())
      .get(`/wardrobe/${garment.id}`)
      .expect(200)
      .expect((getResponse) => {
        expect(getResponse.body.id).toBe(garment.id);
      });
  });

  it('returns 404 for an unknown garment id', async () => {
    await request(app.getHttpServer())
      .get('/wardrobe/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });

  it('rejects an upload with no file', async () => {
    await request(app.getHttpServer()).post('/wardrobe').expect(400);
  });
});
