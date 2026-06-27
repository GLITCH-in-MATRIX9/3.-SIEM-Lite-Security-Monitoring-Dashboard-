import { randomUUID } from "crypto";

import { getRabbitMQChannel } from "../../config/rabbitmq.config";
import {
  EXCHANGES,
  ROUTING_KEYS,
} from "../queues";

export class LogProducer {
  /**
   * Publish a log event to RabbitMQ.
   */
  async publishLog(log: {
    id: string;
    deviceId: string;
    severity: string;
    source: string;
    normalizedEvent: string | null;
  }): Promise<void> {
    const channel = getRabbitMQChannel();

    const event = {
      eventId: randomUUID(),

      eventType: "LOG_CREATED",

      timestamp: new Date().toISOString(),

      payload: {
        logId: log.id,
        deviceId: log.deviceId,
        severity: log.severity,
        source: log.source,
        normalizedEvent: log.normalizedEvent,
      },
    };

    channel.publish(
      EXCHANGES.SIEM,
      ROUTING_KEYS.LOG_CREATED,
      Buffer.from(JSON.stringify(event)),
      {
        persistent: true,
        contentType: "application/json",
      }
    );

    console.log(`📤 Published log event: ${log.id}`);
  }
}

export const logProducer = new LogProducer();