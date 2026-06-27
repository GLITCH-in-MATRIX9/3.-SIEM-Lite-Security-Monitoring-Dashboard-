import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service";

export class DashboardController {
  constructor(
    private readonly dashboardService = new DashboardService()
  ) {}

  /**
   * GET /dashboard/overview
   */
  async getDashboardOverview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dashboard =
        await this.dashboardService.getDashboardOverview();

      return res.status(200).json({
        success: true,
        message: "Dashboard overview fetched successfully.",
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/device-stats
   */
  async getDeviceStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.dashboardService.getDeviceStats();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/log-stats
   */
  async getLogStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.dashboardService.getLogStats();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/alert-stats
   */
  async getAlertStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.dashboardService.getAlertStats();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/rule-stats
   */
  async getRuleStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.dashboardService.getRuleStats();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/severity-distribution
   */
  async getSeverityDistribution(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await this.dashboardService.getSeverityDistribution();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/top-devices
   */
  async getTopAttackedDevices(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await this.dashboardService.getTopAttackedDevices();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/recent-alerts
   */
  async getRecentAlerts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await this.dashboardService.getRecentAlerts();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/attack-trend
   */
  async getAttackTrend(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await this.dashboardService.getAttackTrend();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}