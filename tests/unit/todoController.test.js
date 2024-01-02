const httpMocks = require('node-mocks-http');

const todoController = require('../../controllers/todoController');
const TodoModel = require('../../model/Todo');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');
const todo = require('../mock-data/todo.json');

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();

let req, res, next;
const todoId = '6590ea13b5020f2082cbdcb9';

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('todoController.updateTodo', () => {
  it('should have a updateTodo function', () => {
    expect(typeof todoController.updateTodo).toBe('function');
  });

  it('should update with TodoModel.findByIdAndUpdate', async () => {
    req.params.id = todoId;
    req.body = newTodo;
    await todoController.updateTodo(req, res, next);
    TodoModel.findByIdAndUpdate(todoId, newTodo, {
      new: true,
      useFindAndModify: false,
    });
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false,
    });
  });

  it('should return a response with json data and http code 200', async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await todoController.updateTodo(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it('should handle error if todo does not exist', async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await todoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual({ message: 'Todo not found.' });
  });

  it('should handle errors', async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockRejectedValue({
      message: 'Request error.',
    });
    await todoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Request error.',
    });
  });
});

describe('todoController.getTodoById', () => {
  it('should have a getTodoById', () => {
    expect(typeof todoController.getTodoById).toBe('function');
  });

  it('should call TodoModel.findById with route parameters', async () => {
    req.params.id = todoId;
    await todoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toBeCalledWith(todoId);
  });

  it('should return json body and response code 200', async () => {
    req.params.id = todoId;
    TodoModel.findById.mockReturnValue(todo);
    await todoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(todo);
  });

  it('should handle errors', async () => {
    req.params.id = todoId;
    TodoModel.findById.mockRejectedValue({
      message: 'Todo with this id does not exist.',
    });
    await todoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Todo with this id does not exist.',
    });
  });

  it('should handle error when todo does not exists', async () => {
    req.params.id = '658ba00885d494479a9ccf04';
    TodoModel.findById.mockReturnValue(null);
    await todoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Not found',
    });
  });
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
