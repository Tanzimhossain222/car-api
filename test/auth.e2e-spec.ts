import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handle a signup request', () => {
    const TestEmail = 'test2@test.com';
    const TestName = 'Test User';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: TestEmail,
        password: 'password',
        name: TestName,
      })
      .expect(201)
      .then((res) => {
        const { id, email, name } = res.body;
        expect(id).toBeDefined();
        expect(name).toEqual(TestName);
        expect(email).toEqual(TestEmail);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const TestEmail = 'test7@test.com';
    const TestName = 'Test User 7';

    // Signup
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: TestEmail,
        password: 'password',
        name: TestName,
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(TestEmail);
    expect(body.name).toEqual(TestName);
  });
});
