const TodoModel = require('../model/Todo');

const db = require('../database/db');

const createTodo = async (req, res, next) => {
  try {
    await db.connect();
    const createdModel = await TodoModel.create(req.body);
    await db.disconnect();
    res.status(201).json(createdModel);
  } catch (error) {
    await db.disconnect();
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const getTodos = async (req, res, next) => {
  try {
    await db.connect();
    const allTodos = await TodoModel.find({});
    await db.disconnect();
    res.status(200).json(allTodos);
  } catch (error) {
    await db.disconnect();
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const getTodoById = async (req, res, next) => {
  try {
    await db.connect();
    const todo = await TodoModel.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Not found' });
    }
    await db.disconnect();
    res.status(200).json(todo);
  } catch (error) {
    await db.disconnect();
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const updateTodo = async (req, res, next) => {
  try {
    await db.connect();
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        useFindAndModify: false,
      }
    );
    await db.disconnect();
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    await db.disconnect();
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    await db.connect();
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);
    await db.disconnect();
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }
    res.status(200).json(deletedTodo);
  } catch (error) {
    await db.disconnect();
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
