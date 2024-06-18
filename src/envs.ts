import dotenv from "dotenv";

dotenv.config();

interface EnvVariables {
  [key: string]: string | undefined;
}

export const ENV_VARS: EnvVariables = {
  port: process.env.PORT,
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID,
  region: process.env.AWS_REGION,
};
