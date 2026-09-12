import {
  Channel,
  ConsumeMessage,
} from 'amqplib';

import { CONFIGS } from '@/common/configs';
import LogsService from '../logs.service';
import { LogQueueMessage } from './logs.publisher';
import { rabbitMQ } from '@/common/configs/rabbitmq';

const MAX_RETRIES = 4;
const {
  QUEUE_NAME,
  EXCHANGE_NAME,
  DLQ_QUEUE_NAME,
  ROUTING_KEY_NAME,
  LOG_RETRY_5S,
  LOG_RETRY_30S,
  LOG_RETRY_5M,
  LOG_RETRY_30M,
} = CONFIGS.RABBITMQ;

const RETRY_QUEUES = [
  LOG_RETRY_5S,
  LOG_RETRY_30S,
  LOG_RETRY_5M,
  LOG_RETRY_30M,
];

export class LogWorker {
  constructor(
    private readonly channel: Channel,

    private readonly logsService: LogsService,
  ) {}

  async start(): Promise<void> {
    await this.channel.prefetch(100);

    await this.channel.consume(
      QUEUE_NAME,
      async (message) => {
        if (!message) {
          return;
        }

        await this.processMessage(
          message,
        );
      },
      {
        noAck: false,
      },
    );

    console.log(
      `[LogWorker] consuming ${QUEUE_NAME}`,
    );
  }

  private async processMessage(
    message: ConsumeMessage,
  ): Promise<void> {
    let payload: LogQueueMessage;

    try {
      payload = JSON.parse(
        message.content.toString(
          'utf8',
        ),
      );
    } catch (error) {
      console.error(
        '[LogWorker] invalid message',
        error,
      );

      await this.moveToDeadLetter(
        message,
        'invalid_message',
      );

      this.channel.ack(message);

      return;
    }

    try {
      await this.logsService.createAppLog(
        payload.events,
        payload.user_id,
        payload.api_key_id,
      );

      /**
       * Only ACK after PostgreSQL
       * successfully accepted the event.
       */
      this.channel.ack(message);
    } catch (error) {
      console.error(
        '[LogWorker] failed to store log',
        {
        //   eventId:
        //     payload.event.id,
          error,
        },
      );

      await this.retry(
        message,
      );
    }
  }

  private async retry(
    message: ConsumeMessage,
  ): Promise<void> {
    const retryCount =
      this.getRetryCount(message);

    if (
      retryCount >= MAX_RETRIES
    ) {
      await this.moveToDeadLetter(
        message,
        'max_retries_exceeded',
      );

      this.channel.ack(message);

      return;
    }

    const retryQueue =
      RETRY_QUEUES[retryCount];

    this.channel.sendToQueue(
      retryQueue,

      message.content,

      {
        persistent: true,

        contentType:
          message.properties
            .contentType,

        messageId:
          message.properties
            .messageId,

        headers: {
          ...message.properties
            .headers,

          retryCount:
            retryCount + 1,
        },
      },
    );

    /**
     * ACK the original message only
     * after putting it into the retry queue.
     */
    this.channel.ack(message);
  }

  private getRetryCount(
    message: ConsumeMessage,
  ): number {
    const headers =
      message.properties.headers;

    const retryCount =
      headers?.retryCount;

    if (
      typeof retryCount === 'number'
    ) {
      return retryCount;
    }

    return 0;
  }

  private async moveToDeadLetter(
    message: ConsumeMessage,
    reason: string,
  ): Promise<void> {
    this.channel.publish(
      EXCHANGE_NAME,
      ROUTING_KEY_NAME,

      message.content,

      {
        persistent: true,

        contentType:
          message.properties
            .contentType,

        messageId:
          message.properties
            .messageId,

        headers: {
          ...message.properties
            .headers,

          deadLetterReason:
            reason,

          deadLetteredAt:
            new Date().toISOString(),
        },
      },
    );
  }
}

export async function startWorkers(): Promise<void> {
  const logsService = new LogsService();

  const logWorker = new LogWorker(
    rabbitMQ.getConsumerChannel(),
    logsService,
  );

  await logWorker.start();

  console.log("[Workers] all workers started");
}