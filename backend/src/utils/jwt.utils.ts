// Import the jsonwebtoken library which creates and verifies JWTs (tokens).
import jwt from "jsonwebtoken";
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);
// Shape of the data we put into the access token (a simple TypeScript type).
export interface AccessTokenPayload {
  // Unique user identifier.
  id: string;
  // User's email address.
  email: string;
  // Role name used for authorization checks (e.g., 'admin', 'user').
  role: string;
  // ID of the organization the user belongs to.
  organizationId: string;
}

// How long the signed access token should be valid for (15 minutes here).
const ACCESS_TOKEN_EXPIRY = "15m";

// Create (sign) a JWT access token from the given payload and return it.
export function signAccessToken(
  // The data we want to put inside the token.
  payload: AccessTokenPayload,
): string {
  // jwt.sign builds and signs the token using a secret key from env vars.
  // The `process.env.JWT_SECRET!` uses TypeScript's non-null assertion —
  // it assumes the environment variable is present at runtime.
  return jwt.sign(
    // The actual data stored in the token.
    payload,
    // Secret key used to sign the token. Keep this private and secure.
    process.env.JWT_SECRET!,
    {
      // Make the token expire after the configured time to limit risk.
      expiresIn: ACCESS_TOKEN_EXPIRY,
      // The hashing algorithm used for the signature.
      algorithm: "HS256",
      // Optional metadata about who issued the token.
      issuer: "siem-lite",
      // Optional metadata describing the intended audience of the token.
      audience: "siem-lite-api",
    },
  );
}

// Verify a token and return the decoded payload if it's valid.
export function verifyAccessToken(
  // The JWT string received from a client (e.g., Authorization header).
  token: string,
): AccessTokenPayload {
  // jwt.verify checks the signature, expiry, and other options.
  // If verification fails it throws an error (so callers should catch it).
  return jwt.verify(
    // The token to verify.
    token,
    // The same secret used to sign tokens. Must match or verification fails.
    process.env.JWT_SECRET!,
    {
      // Accept only the expected signing algorithm.
      algorithms: ["HS256"],
      // Ensure the token was issued by our service.
      issuer: "siem-lite",
      // Ensure the token is meant for our API.
      audience: "siem-lite-api",
    },
  ) as AccessTokenPayload;
}

export function signRefreshToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

export function verifyRefreshToken(token: string): AccessTokenPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!, {
    algorithms: ["HS256"],
  }) as AccessTokenPayload;
}
