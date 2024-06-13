import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/responseTypes";

const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode || 500).json({ error: error.message });
};

export default errorHandler;
