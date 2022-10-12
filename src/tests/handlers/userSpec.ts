import app from '../../index';
import jwt from 'jsonwebtoken';
import client from '../../config';
import supertest from 'supertest';

const request = supertest(app);

const newUser = {
  username: 'testUser',
  firstname: 'testName',
  lastname: 'testLastName',
  password: 'test123'
};

const token = jwt.sign(newUser, process.env.TOKEN_SECRET as string);

describe('User Endpoint Tests', (): void => {
  it('index method should return all users', async (): Promise<void> => {
    const response = await request.post('/users').send({
      username: 'testUser',
      firstname: 'testName',
      lastname: 'testLastName',
      password: 'test123'
    });
    expect(response.status).toBe(200);
  });

  it('Should fail to get all users', async (): Promise<void> => {
    const response = await request.get('/users');
    expect(response.status).toBe(401);
  });

  it('Should fail to get users by id', async (): Promise<void> => {
    const response = await request.get('/users/1');
    expect(response.status).toBe(401);
  });

  it('Should fail to Update users by id', async (): Promise<void> => {
    const response = await request.put('/users/1').send({
      username: 'testUser',
      firstname: 'testName',
      lastname: 'testLastName',
      password: 'test123'
    });
    expect(response.status).toBe(401);
  });

  it('Should fail to delete a user by id', async (): Promise<void> => {
    const response = await request.delete('/users/1');
    expect(response.status).toBe(401);
  });

  describe('Tests Using token', (): void => {
    it('Should get all users with jwt', async (): Promise<void> => {
      const response = await request
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('Should get users by id with jwt', async (): Promise<void> => {
      const response = await request
        .get('/users/1')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('Should Update a user by id with jwt ', async (): Promise<void> => {
      const response = await request
        .put('/users/1')
        .send({
          username: 'testUser',
          firstname: 'testName',
          lastname: 'testLastName',
          password: 'test123'
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('Should delete a user by id with jwt ', async (): Promise<void> => {
      const response = await request
        .delete('/users/1')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    // Delete users table after all specs is tested
    afterAll(async (): Promise<void> => {
      const conn = await client.connect();
      await conn.query(
        'DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      );
      conn.release();
    });
  });
});