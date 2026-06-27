import { getRabbitMQChannel } from "../../config/rabbitmq.config";
import {
  EXCHANGES,
  QUEUES,
  ROUTING_KEYS,
} from "../queues";

export async function setupRabbitMQ(): Promise<void> {
  const channel = getRabbitMQChannel();

  /**
   * Exchange
   */
  await channel.assertExchange(
    EXCHANGES.SIEM,
    "topic",
    {
      durable: true,
    }
  );

  /**
   * Dead Letter Queue
   */
  await channel.assertQueue(
    QUEUES.DEAD_LETTER,
    {
      durable: true,
    }
  );

  /**
   * Retry Queue
   */
  await channel.assertQueue(
    QUEUES.RETRY,
    {
      durable: true,

      deadLetterExchange: EXCHANGES.SIEM,

      deadLetterRoutingKey:
        ROUTING_KEYS.LOG_CREATED,

      messageTtl: 10000,
    }
  );

  /**
   * Main Queue
   */
  await channel.assertQueue(
    QUEUES.LOGS,
    {
      durable: true,

      deadLetterExchange: EXCHANGES.SIEM,

      deadLetterRoutingKey:
        ROUTING_KEYS.DEAD_LETTER,
    }
  );

  /**
   * Bindings
   */
  await channel.bindQueue(
    QUEUES.LOGS,
    EXCHANGES.SIEM,
    ROUTING_KEYS.LOG_CREATED
  );

  await channel.bindQueue(
    QUEUES.RETRY,
    EXCHANGES.SIEM,
    ROUTING_KEYS.LOG_RETRY
  );

  await channel.bindQueue(
    QUEUES.DEAD_LETTER,
    EXCHANGES.SIEM,
    ROUTING_KEYS.DEAD_LETTER
  );

  console.log(
    "📦 RabbitMQ infrastructure initialized."
  );
}