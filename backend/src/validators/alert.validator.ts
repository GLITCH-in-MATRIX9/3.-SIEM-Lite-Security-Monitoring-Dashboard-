import { AlertStatus, LogSeverity } from "@prisma/client";
import { z } from "zod";

export const createAlertSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(100, "Title cannot exceed 100 characters."),

    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters.")
      .optional(),

    severity: z.nativeEnum(LogSeverity),

    ruleId: z
      .string()
      .cuid("Invalid rule ID."),

    logId: z
      .string()
      .uuid("Invalid log ID."),
  }),
});

export const updateAlertSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3)
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    severity: z
      .nativeEnum(LogSeverity)
      .optional(),

    status: z
      .nativeEnum(AlertStatus)
      .optional(),
  }),
});

export const updateAlertStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(AlertStatus),
  }),
});

export const alertIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid alert ID."),
  }),
});

export type CreateAlertDto = z.infer<typeof createAlertSchema>;
export type UpdateAlertDto = z.infer<typeof updateAlertSchema>;
export type UpdateAlertStatusDto = z.infer<typeof updateAlertStatusSchema>;
export type AlertIdParamDto = z.infer<typeof alertIdParamSchema>;