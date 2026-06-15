// We use `bcrypt` to securely hash passwords and check them later.
import bcrypt from "bcrypt";

// How many times the hashing algorithm is applied; more rounds = slower but safer.
const SALT_ROUNDS = 12;

// Create a hashed version of a plain password so we never store the raw password.
export async function hashPassword(
  // The password the user typed in (plain text).
  password: string,
): Promise<string> {
  // bcrypt.hash returns a promise that resolves to the hashed string.
  // We pass the plain password and the number of salt rounds to make it unique.
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Check whether a plain password matches a stored bcrypt hash.
export async function comparePassword(
  // The password the user is trying now (plain text).
  password: string,
  // The hashed password we have stored in the database.
  hash: string,
): Promise<boolean> {
  // bcrypt.compare returns true if they match, false otherwise.
  // It uses a safe method so attackers can't easily measure timing differences.
  return bcrypt.compare(password, hash);
}
