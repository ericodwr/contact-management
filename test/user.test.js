import supertest from 'supertest';
import bcrypt from 'bcrypt';

import { web } from '../src/application/web.js';
import { logger } from '../src/application/logging.js';
import { createTestUser, getTestUser, removeTestUser } from './test-util.js';

describe('POST /api/users', () => {
  afterEach(async () => {
    await removeTestUser();
  });

  // Testing successed
  it('should can register new user', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: 'ocire',
      password: 'ocire',
      name: 'ocire dwir',
    });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBe('ocire');
    expect(result.body.data.name).toBe('ocire dwir');
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.message).toBe('Success create user!');
  });

  // Testing wrong user input
  it('should reject if request is invalid', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: '',
      password: '',
      name: '',
    });

    logger.info(result);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Testing Duplicate
  it('should can register new user', async () => {
    let result = await supertest(web).post('/api/users').send({
      username: 'ocire',
      password: 'ocire',
      name: 'ocire dwir',
    });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBe('ocire');
    expect(result.body.data.name).toBe('ocire dwir');
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.message).toBe('Success create user!');

    result = await supertest(web).post('/api/users').send({
      username: 'ocire',
      password: 'ocire',
      name: 'ocire dwir',
    });

    logger.info(result);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should can login', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: 'ocire',
      password: 'ocire',
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe('test');
  });

  it('should error wrong username or password', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: 'ocire',
      password: 'ocire123',
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should can get current user', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'test');

    logger.info(result);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('ocire');
    expect(result.body.data.name).toBe('ocire test');
  });

  it('should reject if token invalid', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'wrong');

    logger.info(result);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should can update user', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        name: 'erico',
        password: 'erico',
      });

    logger.info(result);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('ocire');
    expect(result.body.data.name).toBe('erico');

    const user = await getTestUser();
    expect(await bcrypt.compare('erico', user.password)).toBe(true);
  });

  it('should can update user only password', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        password: 'erico',
      });

    logger.info(result);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('ocire');

    const user = await getTestUser();
    expect(await bcrypt.compare('erico', user.password)).toBe(true);
  });
});

describe('DELETE /api/users/logout', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should can logout', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'test');

    logger.info(result);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe('OK');

    const user = await getTestUser();
    expect(user.token).toBeNull();
  });

  it('reject logout if token invalid', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'wrong');

    logger.info(result);

    expect(result.status).toBe(401);
  });
});
