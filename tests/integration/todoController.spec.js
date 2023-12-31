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

let firstTodo;

describe(endpointUrl, () => {
  it('GET ' + endpointUrl, async () => {
    const response = await request(server.app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });

  it('GET by id ' + endpointUrl + ':id', async () => {
    const response = await request(server.app).get(
      `${endpointUrl}/${firstTodo._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  it('GET todoById does not exist' + endpointUrl + ':id', async () => {
    const response = await request(server.app).get(
      `${endpointUrl}/658ba00885d494479a9ccf04`
    );
    expect(response.statusCode).toBe(404);
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
