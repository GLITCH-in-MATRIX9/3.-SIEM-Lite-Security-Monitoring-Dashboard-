// Data sent when a user creates a new account.
export interface RegisterDto {
  // The user's email address.
  email: string;
  // The username they choose to sign in with.
  username: string;
  // The plain-text password they provide (will be hashed before storing).
  password: string;
}

// Data sent when a user signs in.
export interface LoginDto {
  // The username or identifier they use to log in.
  username: string;
  // The password they enter to authenticate.
  password: string;
  // Optional: if true, keep the user logged in longer (remember device).
  rememberMe?: boolean;
}

// Data sent when a user requests a password reset email.
export interface ForgotPasswordDto {
  // The email where we should send reset instructions.
  email: string;
}

// Data sent to actually reset a forgotten password.
export interface ResetPasswordDto {
  // Token the user received in the reset email (proves identity).
  token: string;
  // The new password the user wants to set.
  newPassword: string;
}
