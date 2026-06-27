import { getRabbitMQChannel } from "../../config/rabbitmq.config";
import {
  EXCHANGES,
  QUEUES,
  ROUTING_KEYS,
} from "../queues";

export class LogConsumer {
  async start(): Promise<void> {
    const channel = getRabbitMQChannel();

    // Ensure exchange exists
    await channel.assertExchange(
      EXCHANGES.SIEM,
      "topic",
      {
        durable: true,
      }
    );

    // Ensure queue exists
    await channel.assertQueue(
      QUEUES.LOGS,
      {
        durable: true,
      }
    );

    // Bind queue
    await channel.bindQueue(
      QUEUES.LOGS,
      EXCHANGES.SIEM,
      ROUTING_KEYS.LOG_CREATED
    );

    console.log("👂 Log consumer started...");

    channel.consume(
      QUEUES.LOGS,
      async (message) => {
        if (!message) return;

        try {
          const event = JSON.parse(
            message.content.toString()
          );

          console.log("📥 Received Event:");
          console.log(event);

          /**
           * Rule Engine
           * Notification
           * Incident Management
           *
           * will be executed here later.
           */

          channel.ack(message);
        } catch (error) {
          console.error(
            "Consumer Error:",
            error
          );

          channel.nack(message, false, false);
        }
      }
    );
  }
}

export const logConsumer = new LogConsumer();