import { Router } from "express";

import { ruleController } from "../controllers/rule.controller";

import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  createRuleSchema,
  updateRuleSchema,
} from "../validators/rule.validator";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createRuleSchema),
  ruleController.createRule,
);

router.get(
  "/",
  authenticate,
  ruleController.getAllRules,
);

router.get(
  "/:id",
  authenticate,
  ruleController.getRuleById,
);

router.patch(
  "/:id",
  authenticate,
  validate(updateRuleSchema),
  ruleController.updateRule,
);

router.delete(
  "/:id",
  authenticate,
  ruleController.deleteRule,
);

export default router;