import { Prisma, DetectionRule } from "@prisma/client";
import { prisma } from "../config/database.config";

export class RuleRepository {
  async create(data: Prisma.DetectionRuleCreateInput): Promise<DetectionRule> {
    return prisma.detectionRule.create({
      data,
    });
  }

  async findAll(): Promise<DetectionRule[]> {
    return prisma.detectionRule.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<DetectionRule | null> {
    return prisma.detectionRule.findUnique({
      where: {
        id,
      },
    });
  }

  async findEnabledRules(): Promise<DetectionRule[]> {
  return prisma.detectionRule.findMany({
    where: {
      enabled: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

  async update(
    id: string,
    data: Prisma.DetectionRuleUpdateInput,
  ): Promise<DetectionRule> {
    return prisma.detectionRule.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<DetectionRule> {
    return prisma.detectionRule.delete({
      where: {
        id,
      },
    });
  }
}