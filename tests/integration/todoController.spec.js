const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const server = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

dotenv.config();

const endpointUrl = '/';

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe(endpointUrl, () => {
  it('POST ' + endpointUrl, async () => {
    const response = await request(server.app).post('/todos').send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });
});
