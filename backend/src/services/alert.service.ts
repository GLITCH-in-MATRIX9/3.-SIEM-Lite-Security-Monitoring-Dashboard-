import { Alert, LogSeverity } from "@prisma/client";

import { AlertRepository } from "../repositories/alert.repository";
import { AuditRepository } from "../repositories/audit.repository";

const alertRepository = new AlertRepository();
const auditRepository = new AuditRepository();

export class AlertService {
  constructor(
    private alertRepository: AlertRepository,
    private auditRepository: AuditRepository,
  ) {}

  async createAlert(data: {
    title: string;
    description?: string;
    severity: LogSeverity;
    ruleId: string;
    logId: string;
    createdById?: string;
    userIp?: string;
  }): Promise<Alert> {
    const alert = await this.alertRepository.create({
      title: data.title,
      description: data.description,
      severity: data.severity,
      rule: {
        connect: {
          id: data.ruleId,
        },
      },
      log: {
        connect: {
          id: data.logId,
        },
      },
    });

    await this.auditRepository.create({
      userId: data.createdById,
      action: "ALERT_CREATED",
      resource: alert.id,
      metadata: {
        severity: alert.severity,
        ruleId: data.ruleId,
        logId: data.logId,
      },
      ipAddress: data.userIp,
    });

    return alert;
  }

  async getAlerts() {
    return this.alertRepository.findAll();
  }

  async getAlertById(id: string) {
    const alert = await this.alertRepository.findById(id);

    if (!alert) {
      throw new Error("Alert not found.");
    }

    return alert;
  }

  async acknowledgeAlert(
    id: string,
    acknowledgedById: string,
    userIp?: string,
  ) {
    await this.getAlertById(id);

    const alert = await this.alertRepository.update(id, {
      status: "ACKNOWLEDGED",
      acknowledgedBy: {
        connect: {
          id: acknowledgedById,
        },
      },
    });

    await this.auditRepository.create({
      userId: acknowledgedById,
      action: "ALERT_ACKNOWLEDGED",
      resource: alert.id,
      metadata: {
        status: alert.status,
      },
      ipAddress: userIp,
    });

    return alert;
  }

  async resolveAlert(
    id: string,
    resolvedById: string,
    userIp?: string,
  ) {
    await this.getAlertById(id);

    const alert = await this.alertRepository.update(id, {
      status: "RESOLVED",
      resolvedBy: {
        connect: {
          id: resolvedById,
        },
      },
    });

    await this.auditRepository.create({
      userId: resolvedById,
      action: "ALERT_RESOLVED",
      resource: alert.id,
      metadata: {
        status: alert.status,
      },
      ipAddress: userIp,
    });

    return alert;
  }

  async deleteAlert(
    id: string,
    deletedById?: string,
    userIp?: string,
  ) {
    const alert = await this.getAlertById(id);

    await this.auditRepository.create({
      userId: deletedById,
      action: "ALERT_DELETED",
      resource: alert.id,
      metadata: {
        title: alert.title,
        severity: alert.severity,
      },
      ipAddress: userIp,
    });

    return this.alertRepository.delete(id);
  }
}

export const alertService = new AlertService(
  alertRepository,
  auditRepository,
);