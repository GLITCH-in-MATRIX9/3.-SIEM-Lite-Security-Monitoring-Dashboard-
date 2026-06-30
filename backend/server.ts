import { errorHandler } from "./src/middleware/errorHandler.middleware";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes";
import deviceRoutes from "./src/routes/device.routes";
import logRoutes from "./src/routes/log.routes";
import ruleRoutes from "./src/routes/rule.routes";
import alertRoutes from "./src/routes/alert.routes";
import dashboardRoutes from "./src/routes/dashboard.routes";
import { connectRabbitMQ, closeRabbitMQ } from "./src/config/rabbitmq.config";
import { logConsumer } from "./src/messaging/consumer/log.consumer";
import { setupRabbitMQ } from "./src/messaging/infrastructure/rabbitmq.setup";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  }),
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/devices", deviceRoutes);
app.use("/api/v1/logs", logRoutes);
app.use("/api/v1/rules", ruleRoutes);
app.use("/api/v1/alerts", alertRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.get("/", (_, res) => {
  res.json({
    message: "SIEM Lite Backend Running",
  });
});

const PORT = process.env.PORT || 5000;
app.use(errorHandler);

async function startServer() {
  try {
    // Connect to RabbitMQ
    await connectRabbitMQ();

    // Initialize RabbitMQ infrastructure
    await setupRabbitMQ();

    // Start the log consumer
    await logConsumer.start();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\nShutting down server...");

      await closeRabbitMQ();

      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\nShutting down server...");

      await closeRabbitMQ();

      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
