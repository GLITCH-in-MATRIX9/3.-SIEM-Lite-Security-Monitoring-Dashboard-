/**
 * RabbitMQ Exchanges
 */
export const EXCHANGES = {
  SIEM: process.env.RABBITMQ_EXCHANGE || "siem.exchange",
} as const;

/**
 * RabbitMQ Queues
 */
export const QUEUES = {
  LOGS: process.env.RABBITMQ_LOG_QUEUE || "siem.logs",

  RETRY: "siem.logs.retry",

  DEAD_LETTER:
    process.env.RABBITMQ_DLQ || "siem.deadletter",

  ALERTS:
    process.env.RABBITMQ_ALERT_QUEUE || "siem.alerts",

  NOTIFICATIONS:
    process.env.RABBITMQ_NOTIFICATION_QUEUE ||
    "siem.notifications",
} as const;

/**
 * RabbitMQ Routing Keys
 */
export const ROUTING_KEYS = {
  LOG_CREATED: "log.created",

  LOG_RETRY: "log.retry",

  DEAD_LETTER: "log.dead",

  ALERT_CREATED: "alert.created",

  NOTIFICATION_CREATED:
    "notification.created",
} as const;