const express = require('express');

const todoController = require('../controllers/todoController');

const router = express.Router();

router.post('/', todoController.createTodo);

module.exports = router;
