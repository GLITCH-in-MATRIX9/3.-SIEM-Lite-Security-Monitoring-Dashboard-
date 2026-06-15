import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),

  username: z
    .string()
    .min(3)
    .max(50),

  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const forgotPasswordSchema =
  z.object({
    email: z.email(),
  });

export const resetPasswordSchema =
  z.object({
    token: z.string(),
    newPassword: registerSchema.shape.password,
  });