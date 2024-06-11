import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/responseTypes";

const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
