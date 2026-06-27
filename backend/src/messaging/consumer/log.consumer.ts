import { getRabbitMQChannel } from "../../config/rabbitmq.config";
import { QUEUES } from "../queues";

import { LogRepository } from "../../repositories/log.repository";
import { ruleEngine } from "../../detection/rule.engine";

const logRepository = new LogRepository();

export class LogConsumer {
  async start(): Promise<void> {
    const channel = getRabbitMQChannel();

    console.log("👂 Log consumer started...");

    channel.consume(QUEUES.LOGS, async (message) => {
      if (!message) return;

      try {
        const event = JSON.parse(
          message.content.toString()
        );

        console.log(
          `📥 Processing log ${event.payload.logId}`
        );

        const log = await logRepository.findById(
          event.payload.logId
        );

        if (!log) {
          console.warn(
            `⚠️ Log not found: ${event.payload.logId}`
          );

          channel.ack(message);
          return;
        }

        await ruleEngine.evaluate(log);

        console.log(
          `✅ Rule evaluation completed for ${log.id}`
        );

        channel.ack(message);
      } catch (error) {
        console.error(
          "❌ Consumer processing failed:",
          error
        );

        // Temporary retry
        channel.nack(message, false, true);
      }
    });
  }
}

export const logConsumer = new LogConsumer();