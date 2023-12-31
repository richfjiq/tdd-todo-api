const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

router.get('/:id', todoController.getTodoById);
router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);

module.exports = router;
