const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT);

const broadcast = (message) => {
  io.emit('message', message);
};

io.on('connection', (socket) => {
  socket.on('message', broadcast);
});
