const httpMocks = require('node-mocks-http');

const todoController = require('../../controllers/todoController');
const TodoModel = require('../../model/todoModel');
const newTodo = require('../mock-data/new-todo.json');

TodoModel.create = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

describe('todoController.createTodo', () => {
  it('should have a createTodo function', () => {
    expect(typeof todoController.createTodo).toBe('function');
  });

  it('should call TodoModel.create', () => {
    req.body = newTodo;
    todoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it('should return 201 response code', () => {
    req.body = newTodo;
    todoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return json body in response', () => {
    TodoModel.create.mockReturnValue(newTodo);
    todoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
});
