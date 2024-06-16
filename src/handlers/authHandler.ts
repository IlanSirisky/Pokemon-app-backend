import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const userPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USER_POOL_ID || "",
  ClientId: process.env.COGNITO_CLIENT_ID || "",
});

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
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

  const cognitoUser = new CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const attributeList = [
    new CognitoUserAttribute({ Name: "email", Value: email }),
    new CognitoUserAttribute({ Name: "preferred_username", Value: username }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const confirmSignup = async (username: string, code: string) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };
  
    const cognitoUser = new CognitoUser(userData);
  
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

export default {
  login,
  register,
  confirmSignup,
};
