import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";

const router = Router();

const dashboardController = new DashboardController();

/**
 * Dashboard Overview
 */
router.get(
  "/overview",
  authenticate,
  authorize("ADMIN", "ANALYST", "OPERATOR", "VIEWER"),
  dashboardController.getDashboardOverview.bind(dashboardController)
);

/**
 * Device Statistics
 */
router.get(
  "/device-stats",
  authenticate,
  authorize("ADMIN", "ANALYST", "OPERATOR", "VIEWER"),
  dashboardController.getDeviceStats.bind(dashboardController)
);

/**
 * Log Statistics
 */
router.get(
  "/log-stats",
  authenticate,
  authorize("ADMIN", "ANALYST", "OPERATOR", "VIEWER"),
  dashboardController.getLogStats.bind(dashboardController)
);

/**
 * Alert Statistics
 */
router.get(
  "/alert-stats",
  authenticate,
  authorize("ADMIN", "ANALYST", "OPERATOR", "VIEWER"),
  dashboardController.getAlertStats.bind(dashboardController)
);

/**
 * Rule Statistics
 */
router.get(
  "/rule-stats",
  authenticate,
  authorize("ADMIN", "ANALYST", "OPERATOR", "VIEWER"),
  dashboardController.getRuleStats.bind(dashboardController)
);

/**
 * Severity Distribution
 */
router.get(
  "/severity-distribution",
  authenticate,
  authorize("ADMIN", "ANALYST", "OPERATOR", "VIEWER"),
  dashboardController
    .getSeverityDistribution
    .bind(dashboardController)
);

/**
 * Top Attacked Devices
 */
router.get(
  "/top-devices",
  authenticate,
  authorize("ADMIN", "ANALYST", "OPERATOR", "VIEWER"),
  dashboardController
    .getTopAttackedDevices
    .bind(dashboardController)
);

/**
 * Recent Alerts
 */
router.get(
  "/recent-alerts",
  authenticate,
  authorize("ADMIN", "ANALYST", "OPERATOR", "VIEWER"),
  dashboardController
    .getRecentAlerts
    .bind(dashboardController)
);

/**
 * Attack Trend
 */
router.get(
  "/attack-trend",
  authenticate,
  authorize("ADMIN", "ANALYST", "OPERATOR", "VIEWER"),
  dashboardController
    .getAttackTrend
    .bind(dashboardController)
);

export default router;