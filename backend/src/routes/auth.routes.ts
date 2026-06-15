import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";

const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", authController.register);

router.post("/login", authController.login);

// We'll wire these later after middleware is ready
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
  "/reset-password",
  authController.resetPassword
);

router.get("/me", authController.me);

export default router;