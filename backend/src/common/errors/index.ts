// Import the shared base error class that all app-specific errors extend.
import { AppError } from "./AppError";

// Define a 400-level error for requests that cannot be processed as sent.
export class BadRequestError extends AppError {
  // Accept an optional message, defaulting to the standard bad request text.
  constructor(message = "Bad Request") {
    // Pass the message and HTTP status code to the base error implementation.
    super(message, 400);
  }
}

// Define a 401-level error for requests that are not authenticated.
export class UnauthorizedError extends AppError {
  // Accept an optional message, defaulting to the standard unauthorized text.
  constructor(message = "Unauthorized") {
    // Pass the message and HTTP status code to the base error implementation.
    super(message, 401);
  }
}

// Define a 403-level error for requests that are authenticated but not allowed.
export class ForbiddenError extends AppError {
  // Accept an optional message, defaulting to the standard forbidden text.
  constructor(message = "Forbidden") {
    // Pass the message and HTTP status code to the base error implementation.
    super(message, 403);
  }
}

// Define a 404-level error for resources that cannot be found.
export class NotFoundError extends AppError {
  // Accept an optional message, defaulting to the standard not found text.
  constructor(message = "Not Found") {
    // Pass the message and HTTP status code to the base error implementation.
    super(message, 404);
  }
}

// Define a 409-level error for conflicting state or duplicate resources.
export class ConflictError extends AppError {
  // Accept an optional message, defaulting to the standard conflict text.
  constructor(message = "Conflict") {
    // Pass the message and HTTP status code to the base error implementation.
    super(message, 409);
  }
}

// Define a 423-level error for resources that are temporarily locked.
export class LockedError extends AppError {
  // Accept an optional message, defaulting to the standard locked text.
  constructor(message = "Locked") {
    // Pass the message and HTTP status code to the base error implementation.
    super(message, 423);
  }
}
