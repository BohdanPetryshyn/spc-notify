const PORT = process.env.PORT || 3000;
const AMQP_HOST = process.env.AMQP_HOST || 'localhost';
const AMQP_URL = `amqp://${AMQP_HOST}`;

const spcAmqpClient = require('@bpetryshyn/spc-amqp-client');
const io = require('socket.io')(PORT);

const broadcast = message => {
  io.emit('message', message);
};

const startApp = async () => {
  const amqpClient = await spcAmqpClient(AMQP_URL);

  amqpClient.createMessageConsumer(broadcast);

  io.on('connection', socket => {
    socket.on('message', message => {
      console.log('Message received: ', message);
      amqpClient.publishMessage(message);
    });
  });
};

startApp();
