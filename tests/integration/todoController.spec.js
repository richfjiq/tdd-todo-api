const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const server = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

dotenv.config();

const endpointUrl = '/todos';

/* Opening database connection after each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe(endpointUrl, () => {
  it('GET ' + endpointUrl, async () => {
    const response = await request(server.app).get(endpointUrl);
    console.log('------------------------------------', response);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
  });

  it('POST ' + endpointUrl, async () => {
    const response = await request(server.app).post(endpointUrl).send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });

  it(
    'should return error 500 on malformed data with POST' + endpointUrl,
    async () => {
      const response = await request(server.app)
        .post('/todos')
        .send({ title: 'Missing done property.' });
      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: 'Todo validation failed: done: Path `done` is required.',
      });
    }
  );
});
