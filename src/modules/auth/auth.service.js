import { OAuth2Client } from "google-auth-library";
import envConfig from "../../config/env.config.js";
import UserRepository from "../../DB/repositories/user.repository.js";
import { CHANNELS, PROVIDERS, TOKEN_TYPES } from "../../utilities/constants.js";
import { encrypt } from "../../utilities/security/encryption.js";
import { hash, verify } from "../../utilities/security/hash.js";
import {
  createLoginCredentials,
  decodedToken,
  jwtSecrets,
} from "../../utilities/security/tokens.js";
import userRepository from "../../DB/repositories/user.repository.js";
import crypto from "node:crypto";
import { ConflictException } from "../../utilities/Error/exceptions.js";
import { randomUUID } from "node:crypto";
import { blackListToken } from "../../utilities/common/services/redis.service.js";
import { emailEvents, sendEmail } from "../../utilities/common/services/email.service.js";
import {otpTemplate} from '../../utilities/templates/otpTemplate.js'
const client = new OAuth2Client();

export const handleUserUpdatingOrCreation = async ({ user, payload }) => {
  if (user) {
    return UserRepository.updateWithFindById({
      id: user._id,
      data: {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
      },
      options: { new: true },
    });
  } else {
    return UserRepository.createDocument({
      firstName: payload.given_name,
      lastName: payload.given_name,
      email: payload.email,
      provider: PROVIDERS.GOOGLE,
      googleSub: payload.sub,
      password: await hash(crypto.randomBytes(12).toString("hex")),
    });
  }
};

export const buildTokens = async (userData) => {
  let tokenPayload = {
    sub: userData._id,
    email: userData.email,
    role: userData.role,
  };
  const { accessToken, refreshToken } = createLoginCredentials({
    payload: tokenPayload,
    options: {
      access: {
        expiresIn: jwtSecrets[userData.role].accessExpiration,
        jwtid: randomUUID(),
      },
      refresh: {
        expiresIn: jwtSecrets[userData.role].refreshExpiration,
        jwtid: randomUUID(),
      },
    },
  });
  return { accessToken, refreshToken };
};

export const registerService = async (body) => {
  const { firstName, lastName, email, password, gender, phone } = body;
  const emailExist = await UserRepository.findOneDocument({ email });
  if (emailExist) {
    throw new ConflictException("email already exist ", {
      error: "this email is already existed , pls add a different one",
    });
  }
  const hashedPassword = await hash(password);
  const userObject = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    gender,
  };
  if (phone) {
    userObject.phone = encrypt(phone);
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  userObject.OTPs = [
    {
      value: otp,
      expireAt: Date.now() + 10 * 60 * 1000,
      channel: CHANNELS.EMAIL,
    },
  ];



emailEvents.emit('sendemail' ,{
    to: email,
    subject: "hallo mohamed , your OTP code is here",
    html: otpTemplate({ otp })
  })

  return await UserRepository.createDocument(userObject);
};

export const verifyOTPService = async (body) => {
  const { email, otp } = body;
  const user = await UserRepository.findOneDocument({ email });
  if (!user) {
    throw new Error("user not found", { cause: { status: 404 } });
  }
  const validOTP = user.OTPs.find(
    ({value}) => value == otp
  );
  if (!validOTP) {
    throw new Error("invalid or expired OTP", { cause: { status: 400 } });
  }
  const otpArray = user.OTPs.filter(({ value }) => value != otp);
  return await UserRepository.updateWithFindById({
    id: user._id,
    data: {
      isEmailVerified: true,
      OTPs: otpArray
    },
    options: { new: true },
  });
};

export const loginService = async (body) => {
  const { email, password } = body;
  const user = await UserRepository.findOneDocument({
    email,
    provider: PROVIDERS.SYSTEM,
  });
  const isPasswordValid = user && (await verify(user.password, password));
  if (!isPasswordValid) {
    throw new Error("invalid email or password", { cause: { status: 401 } });
  }

  //generate token
  return await buildTokens(user);
};

export const refreshTokenService = async (headers) => {
  const { authorization: refreshToken } = headers;
  const { decodedToken } = await decodedToken({
    token: refreshToken,
    tokenType: TOKEN_TYPES.REFRESH,
  });
  const { accesstoken } = createLoginCredentials({
    payload: {
      id: decodedToken.sub,
      role: decodedToken.role,
      email: decodedToken.email,
    },
    options: {
      access: {
        expiresIn: jwtSecrets[user.role].accessExpiration,
      },
    },
    requiredToken: TOKEN_TYPES.ACCESS,
  });
  return { accesstoken };
};
export const verifyIdToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: envConfig.gcp.webClientId,
  });
  const payload = ticket.getPayload();
  return payload;
};

export const gmailRegisterService = async (body) => {
  const { idToken } = body;
  // 1- verify id token
  const payload = await verifyIdToken(idToken);
  if (!payload || !payload.email_verified) {
    throw new Error("you are not authorized ", { cause: { status: 401 } });
  }

  // 2- get user data from database
  const user = await userRepository.findOneDocument({
    $or: [{ email: payload.email }, { googlesub: payload.sub }],
    provider: PROVIDERS.GOOGLE,
  });

  // 3- create user or update
  let userData = await handleUserUpdatingOrCreation({ user, payload });

  //4- generate user tokens
  return await buildTokens(userData);
};

export const gmailLoginService = async (body) => {
  const { idToken } = body;
  // 1- verify id token
  const payload = await verifyIdToken(idToken);
  if (!payload || !payload.email_verified) {
    throw new Error("you are not authorized ", { cause: { status: 401 } });
  }

  // 2- get user data from database
  const user = await userRepository.findOneDocument({
    $or: [{ email: payload.email }, { googlesub: payload.sub }],
    provider: PROVIDERS.GOOGLE,
  });

  if (!user) {
    throw new Error("user not Found ", { cause: { status: 404 } });
  }
  return await buildTokens(user);
};

export const logoutService = async (accessTokenData, refreshToken) => {
  const { decodedData: refreshTokenData } = await decodedToken({
    token: refreshToken,
    tokenType: TOKEN_TYPES.REFRESH,
  });


  const { exp: accessTokenExpiration, jti: accessTokenId } = accessTokenData;
  const { exp: refreshTokenExpiration, jti: refreshTokenId } = refreshTokenData;

  Promise.all([
    blackListToken({
      key: `bl_${TOKEN_TYPES.ACCESS}_${accessTokenId}`,
      exp: accessTokenExpiration,
    }),
    blackListToken({
      key: `bl_${TOKEN_TYPES.REFRESH}_${refreshTokenId}`,
      exp: refreshTokenExpiration,
    }),
  ]);

  return { message: "user logged out successfully" };
};


