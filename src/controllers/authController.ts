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
    console.log("Login controller");
    const result = await authHandler.login(email, password);
    console.log(result);
    return buildResponse(res, 200, "Login successful", result);
  } catch (error) {
    next(error as AppError);
  }
};
