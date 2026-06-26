import { Alert, AlertStatus, Prisma } from "@prisma/client";
import {prisma} from "../config/database.config";

export class AlertRepository {
  async create(data: Prisma.AlertCreateInput): Promise<Alert> {
    return prisma.alert.create({
      data,
      include: {
        rule: true,
        log: true,
        acknowledgedBy: true,
        resolvedBy: true,
      },
    });
  }

  async findAll(): Promise<Alert[]> {
    return prisma.alert.findMany({
      include: {
        rule: true,
        log: true,
        acknowledgedBy: true,
        resolvedBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<Alert | null> {
    return prisma.alert.findUnique({
      where: { id },
      include: {
        rule: true,
        log: true,
        acknowledgedBy: true,
        resolvedBy: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.AlertUpdateInput
  ): Promise<Alert> {
    return prisma.alert.update({
      where: { id },
      data,
      include: {
        rule: true,
        log: true,
        acknowledgedBy: true,
        resolvedBy: true,
      },
    });
  }

  async delete(id: string): Promise<Alert> {
    return prisma.alert.delete({
      where: { id },
    });
  }

  async findByStatus(status: AlertStatus): Promise<Alert[]> {
    return prisma.alert.findMany({
      where: { status },
      include: {
        rule: true,
        log: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const alertRepository = new AlertRepository();