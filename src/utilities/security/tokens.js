import jwt from "jsonwebtoken";
import userRepository from "../../DB/repositories/user.repository.js";
import envConfig from "../../config/env.config.js";
import { ROLES, TOKEN_TYPES } from "../constants.js";
import { get } from "../common/services/redis.service.js";
import { BadRequestException } from "../Error/exceptions.js";
export let jwtSecrets = envConfig.jwt;
// generate token

export const generateToken = ({ payload, secret, options }) => {
  return jwt.sign(payload, secret, options);
};

// verify token

export const verifyToken = ({ token, secret, options }) => {
  return jwt.verify(token, secret, options);
};

// create login credentials

export const createLoginCredentials = ({ payload, options, requiredToken }) => {
  const signatures = getSignatureByTypeAndRole({
    role: payload.role,
    both: true,
  });

  let accessToken, refreshToken;
  switch (requiredToken) {
    case TOKEN_TYPES.ACCESS:
      accessToken = generateToken({
        payload,
        secret: signatures.accessSignature,
        options: options.access,
      });
      break;
    case TOKEN_TYPES.REFRESH:
      refreshToken = generateToken({
        payload,
        secret: signatures.refreshSignature,
        options: options.refresh,
      });
      break;
    default:
      accessToken = generateToken({
        payload,
        secret: signatures.accessSignature,
        options: options.access,
      });
      refreshToken = generateToken({
        payload,
        secret: signatures.refreshSignature,
        options: options.refresh,
      });
      break;
  }

  return { accessToken, refreshToken };
};

export const decodedToken = async ({ token, tokenType }) => {
  const data = jwt.decode(token);
  if (!data) throw new Error("invalid token", { cause: { status: 401 } })
  const signature = getSignatureByTypeAndRole({ role: data.role, tokenType });

  const decodedData = verifyToken({ token, secret: signature });

  const isBlackListed = await get({key:`bl_${tokenType}_${decodedData.jti}`})
  if(isBlackListed) throw new BadRequestException('your session is ended , login again')
  
  const user = await userRepository.findDocumentById(decodedData.sub);
  return { user, decodedData };
};
export const detectSignatureByRole = (role) => {
  let signatures;
  if (role == ROLES.ADMIN) {
    signatures = jwtSecrets.admin;
  } else {
    signatures = jwtSecrets.user;
  }
  return signatures;
};

export const getSignatureByTypeAndRole = ({
  role,
  tokenType,
  both = false,
}) => {
  const signatures = detectSignatureByRole(role);
  if (both) return signatures;
  let tokensignature;
  switch (tokenType) {
    case TOKEN_TYPES.ACCESS:
      tokensignature = signatures.accessSignature;
      break;
    case TOKEN_TYPES.REFRESH:
      tokensignature = signatures.refreshSignature;
      break;

    default:
      throw new Error("invalid token type", { cause: { status: 400 } });
  }
  return tokensignature;
};

