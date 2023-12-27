const TodoModel = require('../model/Todo');

const db = require('../database/db');

const home = (req, res, next) => {
  res.status(200).json({ message: 'Welcome home :)' });
};

const createTodo = async (req, res, next) => {
  try {
    await db.connect();
    const createdModel = await TodoModel.create(req.body);
    await db.disconnect();
    res.status(201).json(createdModel);
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
    // next(error);
  }
};

module.exports = {
  home,
  createTodo,
};
