const dotenv = require('dotenv');
const Server = require('./model/Server');

dotenv.config();

const server = new Server();
const app = server.app;

server.listen();
// const express = require('express');

// const todoRoutes = require('./routes/todo');
// const db = require('./database/db');

// db.connect();
// const app = express();

// app.use(express.json());

// app.use('/todos', todoRoutes);

// app.get('/', (req, res) => {
//   res.json('Hello world!');
// });

module.exports = app;
