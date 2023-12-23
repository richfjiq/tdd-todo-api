const TodoModel = require('../model/todoModel');

const createTodo = async (req, res, next) => {
  const createdModel = await TodoModel.create(req.body);
  res.status(201).json(createdModel);
};

module.exports = {
  createTodo,
};
