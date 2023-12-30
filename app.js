const Server = require('./model/Server');

const server = new Server();
if (process.env.NODE_ENV !== 'test') {
  server.app.listen(process.env.PORT ?? '3000', () => {
    console.log(`Server running on port ${process.env.PORT ?? '3000'}`);
  });
}

module.exports = server;
