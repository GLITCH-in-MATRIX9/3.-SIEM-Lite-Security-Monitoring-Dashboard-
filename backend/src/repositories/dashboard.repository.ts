import { PrismaClient } from "@prisma/client";
import {
  AlertStats,
  AttackTrend,
  DeviceStats,
  LogStats,
  RuleStats,
  SeverityDistribution,
  TopAttackedDevice,
} from "../types/dashboard.types";

const prisma = new PrismaClient();

export class DashboardRepository {
  /**
   * Device Statistics
   */
  async getDeviceStats(): Promise<DeviceStats> {
    const [total, online, offline] = await Promise.all([
      prisma.device.count(),

      prisma.device.count({
        where: {
          status: "ONLINE",
        },
      }),

      prisma.device.count({
        where: {
          status: "OFFLINE",
        },
      }),
    ]);

    return {
      total,
      online,
      offline,
    };
  }

  /**
   * Log Statistics
   */
  async getLogStats(): Promise<LogStats> {
    const total = await prisma.log.count();

    return {
      total,
    };
  }

  /**
   * Rule Statistics
   */
  async getRuleStats(): Promise<RuleStats> {
    const [enabled, disabled] = await Promise.all([
      prisma.detectionRule.count({
        where: {
          enabled: true,
        },
      }),

      prisma.detectionRule.count({
        where: {
          enabled: false,
        },
      }),
    ]);

    return {
      enabled,
      disabled,
    };
  }

  /**
   * Alert Statistics
   */
  async getAlertStats(): Promise<AlertStats> {
    const [
      total,
      open,
      acknowledged,
      resolved,
      critical,
    ] = await Promise.all([
      prisma.alert.count(),

      prisma.alert.count({
        where: {
          status: "OPEN",
        },
      }),

      prisma.alert.count({
        where: {
          status: "ACKNOWLEDGED",
        },
      }),

      prisma.alert.count({
        where: {
          status: "RESOLVED",
        },
      }),

      prisma.alert.count({
        where: {
          severity: "CRITICAL",
        },
      }),
    ]);

    return {
      total,
      open,
      acknowledged,
      resolved,
      critical,
    };
  }

  /**
   * Severity Distribution
   */
  async getSeverityDistribution(): Promise<SeverityDistribution[]> {
    const result = await prisma.alert.groupBy({
      by: ["severity"],

      _count: {
        severity: true,
      },
    });

    return result.map((item) => ({
      severity: item.severity,
      count: item._count.severity,
    }));
  }

  /**
   * Top Attacked Devices
   */
  async getTopAttackedDevices(): Promise<TopAttackedDevice[]> {
    const grouped = await prisma.log.groupBy({
      by: ["deviceId"],

      _count: {
        deviceId: true,
      },

      orderBy: {
        _count: {
          deviceId: "desc",
        },
      },

      take: 10,
    });

    const deviceIds = grouped.map((item) => item.deviceId);

    const devices = await prisma.device.findMany({
      where: {
        id: {
          in: deviceIds,
        },
      },

      select: {
        id: true,
        hostname: true,
      },
    });

    return grouped.map((item) => ({
      deviceId: item.deviceId,

      hostname:
        devices.find((d) => d.id === item.deviceId)?.hostname ??
        "Unknown Device",

      attacks: item._count.deviceId,
    }));
  }

  /**
   * Recent Alerts
   */
  async getRecentAlerts() {
    return prisma.alert.findMany({
      take: 10,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        rule: true,

        log: {
          include: {
            device: true,
          },
        },

        acknowledgedBy: {
          select: {
            id: true,
            username: true,
          },
        },

        resolvedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Attack Trend
   */
  async getAttackTrend(): Promise<AttackTrend[]> {
    const result = await prisma.$queryRaw<
      {
        date: Date;
        attacks: bigint;
      }[]
    >`
        SELECT
            DATE("createdAt") AS date,
            COUNT(*)::bigint AS attacks
        FROM "Alert"
        GROUP BY DATE("createdAt")
        ORDER BY DATE("createdAt")
    `;

    return result.map((item) => ({
      date: item.date.toISOString().split("T")[0],

      attacks: Number(item.attacks),
    }));
  }
}