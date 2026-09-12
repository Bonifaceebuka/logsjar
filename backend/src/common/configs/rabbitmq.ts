import amqplib, {
  Channel,
  ConfirmChannel,
  Connection,
  Options,
} from 'amqplib';
import { CONFIGS } from '.';

export class RabbitMQ {
  private connection?: Awaited<ReturnType<typeof amqplib.connect>>;
  private channel?: Awaited<ReturnType<Awaited<ReturnType<typeof amqplib.connect>>["createChannel"]>>;

  private publisherChannel?: ConfirmChannel;

  private consumerChannel?: Channel;

  async connect(): Promise<void> {
    this.connection = await amqplib.connect(CONFIGS.RABBITMQ.URL!);
    this.channel = await this.connection.createChannel();
    
    this.connection.on(
      'error',
      (error) => {
        console.error(
          '[RabbitMQ] connection error',
          error,
        );
      },
    );

    this.connection.on(
      'close',
      () => {
        console.error(
          '[RabbitMQ] connection closed',
        );
      },
    );

    this.publisherChannel =
      await this.connection.createConfirmChannel();

    this.consumerChannel =
      await this.connection.createChannel();

    await this.setupTopology();

    console.log(
      '[RabbitMQ] connected',
    );
  }

  private async setupTopology(): Promise<void> {
    if (
      !this.publisherChannel ||
      !this.consumerChannel
    ) {
      throw new Error(
        'RabbitMQ channels are not initialized',
      );
    }

    const publisher =
      this.publisherChannel;

    const consumer =
      this.consumerChannel;

    /**
     * Main exchange.
     */
    await publisher.assertExchange(
      CONFIGS.RABBITMQ.EXCHANGE_NAME,
      'direct',
      {
        durable: true,
      },
    );

    /**
     * Main ingestion queue.
     */
    await publisher.assertQueue(
      CONFIGS.RABBITMQ.QUEUE_NAME,
      {
        durable: true,

        arguments: {
          'x-queue-type': 'quorum',
        },
      },
    );

    await publisher.bindQueue(
      CONFIGS.RABBITMQ.QUEUE_NAME,
      CONFIGS.RABBITMQ.EXCHANGE_NAME,
      CONFIGS.RABBITMQ.ROUTING_KEY_NAME,
    );

    /**
     * Dead letter queue.
     */
    await publisher.assertQueue(
      CONFIGS.RABBITMQ.DLQ_QUEUE_NAME,
      {
        durable: true,

        arguments: {
          'x-queue-type': 'quorum',
        },
      },
    );

    await publisher.bindQueue(
      CONFIGS.RABBITMQ.DLQ_QUEUE_NAME,
      CONFIGS.RABBITMQ.EXCHANGE_NAME,
      CONFIGS.RABBITMQ.ROUTING_KEY_NAME,
    );

    /**
     * Retry queues.
     *
     * After TTL expires, RabbitMQ
     * dead-letters the message back
     * to the main exchange.
     */

    await this.createRetryQueue(
      publisher,
      CONFIGS.RABBITMQ.LOG_RETRY_5S,
      5_000,
    );

    await this.createRetryQueue(
      publisher,
      CONFIGS.RABBITMQ.LOG_RETRY_30S,
      30_000,
    );

    await this.createRetryQueue(
      publisher,
      CONFIGS.RABBITMQ.LOG_RETRY_5M,
      5 * 60_000,
    );

    await this.createRetryQueue(
      publisher,
      CONFIGS.RABBITMQ.LOG_RETRY_30M,
      30 * 60_000,
    );

    /**
     * Consumer QoS.
     *
     * Don't allow the worker to receive
     * unlimited unprocessed messages.
     */
    await consumer.prefetch(100);
  }

  private async createRetryQueue(
    channel: ConfirmChannel,
    queue: string,
    ttl: number,
  ): Promise<void> {
    await channel.assertQueue(
      queue,
      {
        durable: true,

        arguments: {
          'x-queue-type': 'quorum',

          'x-message-ttl': ttl,

          'x-dead-letter-exchange':
            CONFIGS.RABBITMQ.EXCHANGE_NAME,

          'x-dead-letter-routing-key':
            CONFIGS.RABBITMQ.ROUTING_KEY_NAME,
        },
      },
    );
  }

  public getPublisherChannel(): ConfirmChannel {
    if (!this.publisherChannel) {
      throw new Error(
        'RabbitMQ publisher is not connected',
      );
    }

    return this.publisherChannel;
  }

  getConsumerChannel(): Channel {
    if (!this.consumerChannel) {
      throw new Error(
        'RabbitMQ consumer is not connected',
      );
    }

    return this.consumerChannel;
  }
}

export const rabbitMQ = new RabbitMQ();