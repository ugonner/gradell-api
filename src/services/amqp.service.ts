// rabbitmq.ts (common)
import * as amqp from 'amqplib';
import { IAMQPMessage } from '../utils/typings/ampq-message.typings';
import * as dotenv from 'dotenv';
dotenv.config();

export class AMQPService {
  private static channel: amqp.Channel;

  static async init() {
    const host = process.env.AMQP_HOST;
    const connection = await amqp.connect(`${host}`);
    this.channel = await connection.createChannel();
  }

  static async publish(queue: string, message: IAMQPMessage) {
    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  static async consume(queue: string, callback: (msg: amqp.ConsumeMessage | null) => void) {
    await this.channel.assertQueue(queue);
    this.channel.consume(queue, callback, { noAck: true });
  }
}
