import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils";
console.log({ verifyAccessToken });


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("========== AUTH ==========");
  console.log("Headers:", req.headers);
  console.log("Authorization:", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("Authorization header missing");
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);

    const payload = verifyAccessToken(token);

    console.log("Payload:", payload);

    req.user = payload;

    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);

    return res.status(401).json({
      message: "Invalid token",
      error: error instanceof Error ? error.message : error,
    });
  }
};