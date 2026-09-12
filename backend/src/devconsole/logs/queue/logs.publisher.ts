import {
  ConfirmChannel,
} from 'amqplib';
import { IncomingLogEvent } from '../types/logs.type';
import { CONFIGS } from '@/common/configs';
import { RabbitMQ } from '@/common/configs/rabbitmq';

export interface LogQueueMessage {
  events: IncomingLogEvent[], 
  user_id: number, 
  api_key_id: number
}

export class LogPublisher {
//   constructor(
//     private readonly channel:
//       ConfirmChannel,
//   ) {}

    constructor(
        private readonly rabbitMQ: RabbitMQ
    ) {}

  async publish(
    events: IncomingLogEvent[], 
    user_id: number, 
    api_key_id: number
  ): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const channel =
      this.rabbitMQ.getPublisherChannel();
    for (const event of events) {
      const message: LogQueueMessage = {
        events,
        user_id,
        api_key_id,
      };

      channel.publish(
        CONFIGS.RABBITMQ.EXCHANGE_NAME,
        CONFIGS.RABBITMQ.ROUTING_KEY_NAME,

        Buffer.from(
          JSON.stringify(message),
        ),

        {
          persistent: true,

          contentType:
            'application/json',

        //   messageId: event.id,

          headers: {
            api_key_id,
          },
        },
      );
    }

    /**
     * Wait until RabbitMQ confirms
     * that the messages have been persisted.
     */
    await channel.waitForConfirms();
  }
}