const httpMocks = require('node-mocks-http');

const todoController = require('../../controllers/todoController');
const TodoModel = require('../../model/Todo');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('todoController.getTodos', () => {
  it('should have a getTodos function', () => {
    expect(typeof todoController.getTodos).toBe('function');
  });

  it('should call TodoModel.find({})', async () => {
    await todoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });

  it('should returns response with status 200 and all todos', async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await todoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });

  it('should handle errors', async () => {
    TodoModel.find.mockReturnValue({
      message: 'Error finding todos.',
    });
    await todoController.getTodos(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Error finding todos.',
    });
  });
});

describe('todoController.createTodo', () => {
  it('should have a createTodo function', () => {
    expect(typeof todoController.createTodo).toBe('function');
  });

  it('should call TodoModel.create', async () => {
    req.body = newTodo;
    await todoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it('should return 201 response code', async () => {
    req.body = newTodo;
    await todoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return json body in response', async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await todoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it('should handle errors', async () => {
    TodoModel.create.mockReturnValue({
      message: 'Todo validation failed: done: Path `done` is required.',
    });
    await todoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Todo validation failed: done: Path `done` is required.',
    });
  });
});
