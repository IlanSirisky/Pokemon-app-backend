import { Request, Response, NextFunction } from "express";
import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import NodeCache from "node-cache";
import { UserRequest } from "../types/requestTypes";
import { ENV_VARS } from "../envs";

AWS.config.update({ region: ENV_VARS.region });

const cognito = new AWS.CognitoIdentityServiceProvider();
const tokenCache = new NodeCache({ stdTTL: 3600 }); // Cache tokens for an hour

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access token is required" });
  }

  try {
    const cachedUser = tokenCache.get<{ sub: string }>(token);
    if (cachedUser) {
      (req as UserRequest).user = cachedUser;
      return next();
    }

    // Decode the token to get the user ID
    const decodedToken: any = jwt.decode(token, { complete: true }) as {
      header: { kid: string };
      payload: { sub: string };
    } | null;

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const params = {
      AccessToken: token.replace("Bearer ", ""),
    };

    // Verify the token with Cognito
    await cognito.getUser(params).promise();

    // Attach user ID to request object
    const user = { sub: decodedToken.payload.sub };
    (req as UserRequest).user = user;

    // Cache the token and user info
    tokenCache.set(token, user);

    next();
  } catch (error) {
    console.error("Token verification failed", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
