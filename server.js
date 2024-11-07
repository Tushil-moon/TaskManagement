const jsonServer = require('json-server');
const cors = require('cors'); // Import the cors package
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Points to db.json file
const middlewares = jsonServer.defaults();

// Enable CORS for all routes
server.use(cors()); // Use the cors middleware to handle CORS

server.use(middlewares);
server.use(router);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
