import {
  DetectionRule,
  LogSeverity,
} from "@prisma/client";

import { RuleRepository } from "../repositories/rule.repository";
import { AuditRepository } from "../repositories/audit.repository";

const ruleRepository = new RuleRepository();
const auditRepository = new AuditRepository();

export class RuleService {
  constructor(
    private ruleRepository: RuleRepository,
    private auditRepository: AuditRepository,
  ) {}

  async createRule(data: {
    name: string;
    description?: string;
    eventType: string;
    threshold: number;
    timeWindow: number;
    severity: LogSeverity;
    enabled?: boolean;
    createdById: string;
    userIp?: string;
  }): Promise<DetectionRule> {
    const rule = await this.ruleRepository.create({
      name: data.name,
      description: data.description,
      eventType: data.eventType,
      threshold: data.threshold,
      timeWindow: data.timeWindow,
      severity: data.severity,
      enabled: data.enabled ?? true,
    });

    await this.auditRepository.create({
      userId: data.createdById,
      action: "RULE_CREATED",
      resource: rule.id,
      metadata: {
        name: rule.name,
        eventType: rule.eventType,
        threshold: rule.threshold,
        timeWindow: rule.timeWindow,
        severity: rule.severity,
        enabled: rule.enabled,
      },
      ipAddress: data.userIp,
    });

    return rule;
  }

  async getAllRules(): Promise<DetectionRule[]> {
    return this.ruleRepository.findAll();
  }

  async getRuleById(id: string): Promise<DetectionRule> {
    const rule = await this.ruleRepository.findById(id);

    if (!rule) {
      throw new Error("Detection rule not found.");
    }

    return rule;
  }

  async updateRule(
    id: string,
    data: {
      name?: string;
      description?: string;
      eventType?: string;
      threshold?: number;
      timeWindow?: number;
      severity?: LogSeverity;
      enabled?: boolean;
      updatedById: string;
      userIp?: string;
    },
  ): Promise<DetectionRule> {
    await this.getRuleById(id);

    const updatedRule = await this.ruleRepository.update(id, {
      name: data.name,
      description: data.description,
      eventType: data.eventType,
      threshold: data.threshold,
      timeWindow: data.timeWindow,
      severity: data.severity,
      enabled: data.enabled,
    });

    await this.auditRepository.create({
      userId: data.updatedById,
      action: "RULE_UPDATED",
      resource: updatedRule.id,
      metadata: {
        updatedFields: {
          name: data.name,
          description: data.description,
          eventType: data.eventType,
          threshold: data.threshold,
          timeWindow: data.timeWindow,
          severity: data.severity,
          enabled: data.enabled,
        },
      },
      ipAddress: data.userIp,
    });

    return updatedRule;
  }

  async deleteRule(
    id: string,
    deletedById: string,
    userIp?: string,
  ): Promise<DetectionRule> {
    const rule = await this.getRuleById(id);

    await this.auditRepository.create({
      userId: deletedById,
      action: "RULE_DELETED",
      resource: rule.id,
      metadata: {
        name: rule.name,
        eventType: rule.eventType,
        threshold: rule.threshold,
        timeWindow: rule.timeWindow,
        severity: rule.severity,
      },
      ipAddress: userIp,
    });

    return this.ruleRepository.delete(id);
  }
}

export const ruleService = new RuleService(
  ruleRepository,
  auditRepository,
);