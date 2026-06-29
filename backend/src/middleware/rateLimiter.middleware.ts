import rateLimit from "express-rate-limit";

/**
 * Login Rate Limiter
 * Prevents brute-force login attacks.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again after 15 minutes.",
  },
});

/**
 * Log Ingestion Rate Limiter
 * Prevents flooding of the log ingestion endpoint.
 */
export const logIngestionRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many log ingestion requests. Please try again in a minute.",
  },
});