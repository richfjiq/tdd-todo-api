const express = require('express');

const todoRoutes = require('./routes/todo');
const db = require('./database/db');

db.connect();
const app = express();

app.use(express.json());

app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
  res.json('Hello world!');
});

module.exports = app;
