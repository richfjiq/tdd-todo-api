const TodoModel = require('../model/Todo');

const db = require('../database/db');

const home = (req, res, next) => {
  res.status(200).json({ message: 'Welcome home :)' });
};

const createTodo = async (req, res, next) => {
  db.connect();
  const createdModel = await TodoModel.create(req.body);
  db.disconnect();
  res.status(201).json(createdModel);
};

module.exports = {
  home,
  createTodo,
};
