require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

require('./src/socket')(io);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const indexRouter = require('./src/routes/indexRouter');
app.use('/api/v1', indexRouter);

server.listen(PORT, () => {
  console.log(`server is ok PORT:${PORT}`);
});
