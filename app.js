const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT);

const AmqpConnection = require('./AmqpConnection');

const amqpConnection = new AmqpConnection('spc', `spc-notify-${PORT}`);

const broadcast = message => {
  io.emit('message', message);
};

amqpConnection.on('message', broadcast);

io.on('connection', socket => {
  socket.on('message', message => {
    console.log('Message received: ', message);
    amqpConnection.publish(message);
  });
});

const initAmqp = () => {
  amqpConnection
    .init()
    .then(() => console.log('AMQP connected.'))
    .catch(() => {
      console.log('Retrying to connect AMQP.');
      setTimeout(initAmqp, 1000);
    });
};

initAmqp();
