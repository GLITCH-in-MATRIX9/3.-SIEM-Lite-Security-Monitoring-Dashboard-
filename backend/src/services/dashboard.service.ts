import { DashboardRepository } from "../repositories/dashboard.repository";
import { DashboardOverview } from "../types/dashboard.types";

export class DashboardService {
  constructor(
    private readonly dashboardRepository = new DashboardRepository()
  ) {}

  /**
   * Returns all dashboard analytics required by the frontend.
   */
  async getDashboardOverview(): Promise<DashboardOverview> {
    const [
      devices,
      logs,
      alerts,
      rules,
      severityDistribution,
      topDevices,
      recentAlerts,
      attackTrend,
    ] = await Promise.all([
      this.dashboardRepository.getDeviceStats(),
      this.dashboardRepository.getLogStats(),
      this.dashboardRepository.getAlertStats(),
      this.dashboardRepository.getRuleStats(),
      this.dashboardRepository.getSeverityDistribution(),
      this.dashboardRepository.getTopAttackedDevices(),
      this.dashboardRepository.getRecentAlerts(),
      this.dashboardRepository.getAttackTrend(),
    ]);

    return {
      devices,
      logs,
      alerts,
      rules,
      severityDistribution,
      topDevices,
      recentAlerts,
      attackTrend,
    };
  }

  /**
   * Device statistics widget
   */
  async getDeviceStats() {
    return this.dashboardRepository.getDeviceStats();
  }

  /**
   * Alert statistics widget
   */
  async getAlertStats() {
    return this.dashboardRepository.getAlertStats();
  }

  /**
   * Log statistics widget
   */
  async getLogStats() {
    return this.dashboardRepository.getLogStats();
  }

  /**
   * Rule statistics widget
   */
  async getRuleStats() {
    return this.dashboardRepository.getRuleStats();
  }

  /**
   * Severity distribution chart
   */
  async getSeverityDistribution() {
    return this.dashboardRepository.getSeverityDistribution();
  }

  /**
   * Top attacked devices chart
   */
  async getTopAttackedDevices() {
    return this.dashboardRepository.getTopAttackedDevices();
  }

  /**
   * Recent alerts table
   */
  async getRecentAlerts() {
    return this.dashboardRepository.getRecentAlerts();
  }

  /**
   * Attack trend chart
   */
  async getAttackTrend() {
    return this.dashboardRepository.getAttackTrend();
  }
}