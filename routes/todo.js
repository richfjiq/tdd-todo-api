const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

router.get('/', todoController.home);
router.post('/', todoController.createTodo);

module.exports = router;
