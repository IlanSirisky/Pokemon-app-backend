import { NextFunction, Request, Response } from "express";
import authHandler from "../handlers/authHandler";
import { buildResponse } from "../utils/responseBuilder";
import { AppError } from "../types/responseTypes";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const result = await authHandler.login(email, password);
    return buildResponse(res, 200, "Login successful", result);
  } catch (error) {
    next(error as AppError);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  try {
    const result = await authHandler.register(username, email, password);
    return buildResponse(res, 201, "User registered successfully", result);
  } catch (error) {
    next(error as AppError);
  }
};

export const confirmSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, code } = req.body;

  try {
    const result = await authHandler.confirmSignup(username, code);
    return buildResponse(res, 200, "User confirmed successfully", result);
  } catch (error) {
    next(error as AppError);
  }
};
