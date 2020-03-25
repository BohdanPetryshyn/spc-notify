const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT);

const AmqpConnection = require('./AmqpConnection');

const amqpConnection = new AmqpConnection('spc', `spc-notify-${PORT}`);

const broadcast = message => {
  io.emit('message', message);
};

amqpConnection.on('message', broadcast);

io.on('connection', socket => {
  socket.on('message', message => amqpConnection.publish(message));
});

amqpConnection.init().then(() => console.log('Amqp connected.'));
