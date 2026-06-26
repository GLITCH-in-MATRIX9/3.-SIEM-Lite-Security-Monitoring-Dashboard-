import { Request, Response, NextFunction } from "express";

import {
  AlertService,
  alertService,
} from "../services/alert.service";

export class AlertController {
  constructor(private alertService: AlertService) {}

  createAlert = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const alert = await this.alertService.createAlert({
        ...req.body,
        createdById: (req as any).user.id,
        userIp: req.ip,
      });

      return res.status(201).json({
        success: true,
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  };

  getAlerts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const alerts = await this.alertService.getAlerts();

      return res.status(200).json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      next(error);
    }
  };

  getAlertById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const alert = await this.alertService.getAlertById(req.params.id);

      return res.status(200).json({
        success: true,
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  };

  acknowledgeAlert = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const alert = await this.alertService.acknowledgeAlert(
        req.params.id,
        (req as any).user.id,
        req.ip,
      );

      return res.status(200).json({
        success: true,
        message: "Alert acknowledged successfully.",
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  };

  resolveAlert = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const alert = await this.alertService.resolveAlert(
        req.params.id,
        (req as any).user.id,
        req.ip,
      );

      return res.status(200).json({
        success: true,
        message: "Alert resolved successfully.",
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteAlert = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const alert = await this.alertService.deleteAlert(
        req.params.id,
        (req as any).user.id,
        req.ip,
      );

      return res.status(200).json({
        success: true,
        message: "Alert deleted successfully.",
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const alertController = new AlertController(alertService);