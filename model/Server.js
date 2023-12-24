const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const todoRoutes = require('../routes/todo');

dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT ?? '3000';
    this.apiPaths = {
      todo: '/todos',
    };
    this.middleware();
    this.routes();
  }

  middleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.apiPaths.todo, todoRoutes);
  }
}

module.exports = Server;
