const TodoModel = require('../model/Todo');

const db = require('../database/db');

const createTodo = async (req, res, next) => {
  try {
    await db.connect();
    const createdModel = await TodoModel.create(req.body);
    await db.disconnect();
    res.status(201).json(createdModel);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const getTodos = async (req, res, next) => {
  try {
    await db.connect();
    const allTodos = await TodoModel.find({});
    await db.disconnect();
    console.log(allTodos);
    res.status(200).json(allTodos);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTodo,
  getTodos,
};
