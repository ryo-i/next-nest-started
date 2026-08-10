import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const prismaServiceMock = {
      person: {
        findMany: jest.fn().mockResolvedValue([
          { id: 1, name: '織田信長' },
          { id: 2, name: '豊臣秀吉' },
        ]),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ message: 'Welcome to the API!' });
  });

  it('/persons (GET)', () => {
    return request(app.getHttpServer())
      .get('/persons')
      .expect(200)
      .expect([
        { id: 1, name: '織田信長' },
        { id: 2, name: '豊臣秀吉' },
      ]);
  });
});
