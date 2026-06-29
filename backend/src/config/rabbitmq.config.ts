import amqp, { Channel, Connection } from "amqplib";

let connection: Connection | null = null;
let channel: Channel | null = null;

/**
 * Establishes a connection to RabbitMQ and creates a channel.
 */
export async function connectRabbitMQ(): Promise<Channel> {
  if (channel) {
    return channel;
  }

  try {
    console.log("RABBITMQ_URL =", process.env.RABBITMQ_URL);
    connection = await amqp.connect(process.env.RABBITMQ_URL!);

    channel = await connection.createChannel();

    console.log("🐇 RabbitMQ connected successfully.");

    return channel;
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ:", error);
    throw error;
  }
}

/**
 * Returns the active RabbitMQ channel.
 */
export function getRabbitMQChannel(): Channel {
  if (!channel) {
    throw new Error(
      "RabbitMQ has not been initialized. Call connectRabbitMQ() first."
    );
  }

  return channel;
}

/**
 * Gracefully closes RabbitMQ resources.
 */
export async function closeRabbitMQ(): Promise<void> {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }

    if (connection) {
      await connection.close();
      connection = null;
    }

    console.log("🐇 RabbitMQ connection closed.");
  } catch (error) {
    console.error("Error closing RabbitMQ:", error);
  }
}