const amqp = require('amqplib');
const EventEmitter = require('events');

const AMQP_HOST = process.env.AMQP_HOST || 'localhost';
const AMQP_URL = `amqp://${AMQP_HOST}`;

class AmqpConnection extends EventEmitter {
  constructor(exchangeName, queueName) {
    super();
    this.exchangeName = exchangeName;
    this.queueName = queueName;

    this.consumeMessage = this.consumeMessage.bind(this);
  }

  async init() {
    this.channel = await this.createChannel();
    await Promise.all([this.assertExchange(), this.assertQueue()]);
    await this.bindQueue();
    this.consumeQueue();
  }

  async createChannel() {
    const connection = await amqp.connect(AMQP_URL);
    return connection.createChannel();
  }

  assertExchange() {
    return this.channel.assertExchange(this.exchangeName);
  }

  assertQueue() {
    const options = { exclusive: true };
    return this.channel.assertQueue(this.queueName, options);
  }

  bindQueue() {
    return this.channel.bindQueue(this.queueName, this.exchangeName);
  }

  consumeQueue() {
    this.channel.consume(this.queueName, this.consumeMessage, { noAck: true });
  }

  consumeMessage(msg) {
    const message = JSON.parse(msg.content.toString());
    this.emit('message', message);
  }

  publish(message) {
    const messageBuffer = new Buffer(JSON.stringify(message));
    this.channel.publish(this.exchangeName, '', messageBuffer);
  }
}

module.exports = AmqpConnection;
