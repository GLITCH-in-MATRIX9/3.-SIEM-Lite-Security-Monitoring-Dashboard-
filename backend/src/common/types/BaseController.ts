import { Response } from "express";

export abstract class BaseController {
  protected ok<T>(
    res: Response,
    data?: T,
    message?: string
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  protected created<T>(
    res: Response,
    data?: T,
    message?: string
  ) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  protected accepted<T>(
    res: Response,
    data?: T,
    message?: string
  ) {
    return res.status(202).json({
      success: true,
      message,
      data,
    });
  }

  protected noContent(res: Response) {
    return res.status(204).send();
  }
}