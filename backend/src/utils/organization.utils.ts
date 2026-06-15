import { randomUUID } from "crypto";

export function generateOrganizationId() {
  return randomUUID();
}