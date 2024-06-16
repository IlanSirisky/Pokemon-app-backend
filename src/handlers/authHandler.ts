import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import dotenv from "dotenv";

dotenv.config();

const userPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USER_POOL_ID || "",
  ClientId: process.env.COGNITO_CLIENT_ID || "",
});


export const login = async (email: string, password: string) => {
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };
  console.log("Login handler");

  const cognitoUser = new CognitoUser(userData);
    console.log(cognitoUser);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log("res", result);
        resolve(result);
      },
      onFailure: (err) => {
        console.log("err", err);
        reject(err);
      },
    });
  });
};


export default {
  login,
};
