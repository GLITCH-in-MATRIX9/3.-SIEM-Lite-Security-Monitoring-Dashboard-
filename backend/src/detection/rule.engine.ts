import { Log } from "@prisma/client";

import { RuleRepository } from "../repositories/rule.repository";
import { LogRepository } from "../repositories/log.repository";
import { AlertRepository } from "../repositories/alert.repository";

const ruleRepository = new RuleRepository();
const logRepository = new LogRepository();
const alertRepository = new AlertRepository();

export class RuleEngine {
  async evaluate(log: Log): Promise<void> {
    // Ignore logs that could not be normalized
    if (!log.normalizedEvent) {
      return;
    }

    // Load all enabled detection rules
    const rules = await ruleRepository.findEnabledRules();

    for (const rule of rules) {
      // Skip if event types don't match
      if (rule.eventType !== log.normalizedEvent) {
        continue;
      }

      // Calculate rule time window
      const endTime = new Date();
      const startTime = new Date(
        endTime.getTime() - rule.timeWindow * 60 * 1000,
      );

      // Count matching logs
      const count = await logRepository.countMatchingLogs(
        log.normalizedEvent,
        startTime,
        endTime,
      );

      // Threshold not reached
      if (count < rule.threshold) {
        continue;
      }

      // Create alert
      await alertRepository.create({
        title: rule.name,
        description:
          rule.description ??
          `Detection rule "${rule.name}" triggered.`,
        severity: rule.severity,
        status: "OPEN",
        ruleId: rule.id,
        logId: log.id,
      });
    }
  }
}

export const ruleEngine = new RuleEngine();