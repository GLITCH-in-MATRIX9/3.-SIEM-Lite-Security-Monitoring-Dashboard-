import { Router } from "express";

import { alertController } from "../controllers/alert.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  createAlertSchema,
  alertIdParamSchema,
} from "../validators/alert.validator";

const router = Router();

/*
|--------------------------------------------------------------------------
| Alert Routes
|--------------------------------------------------------------------------
*/

// Create Alert
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createAlertSchema),
  alertController.createAlert,
);

// Get All Alerts
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ANALYST", "VIEWER", "OPERATOR"),
  alertController.getAlerts,
);

// Get Alert By ID
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ANALYST", "VIEWER", "OPERATOR"),
  validate(alertIdParamSchema, "params"),
  alertController.getAlertById,
);

// Acknowledge Alert
router.patch(
  "/:id/acknowledge",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  validate(alertIdParamSchema, "params"),
  alertController.acknowledgeAlert,
);

// Resolve Alert
router.patch(
  "/:id/resolve",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  validate(alertIdParamSchema, "params"),
  alertController.resolveAlert,
);

// Delete Alert
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(alertIdParamSchema, "params"),
  alertController.deleteAlert,
);

export default router;