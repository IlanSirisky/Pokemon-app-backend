import { Response } from "express";

export const buildResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  return res.status(statusCode).json({ message, data });
};
