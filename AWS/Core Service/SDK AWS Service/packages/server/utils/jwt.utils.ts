// import jwt, { Secret, JwtPayload, SignOptions } from 'jsonwebtoken';
import { createSigner, SignerOptions, createVerifier } from 'fast-jwt';
import env from '../configs/env';
import fs from 'fs';
import ApiError from './api-error';
import httpStatus from 'http-status';
import path from 'path';

const signJwt = async (
  payload: Object,
  key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options: any,
  // expiresIn: number
) => {
  const privateKey =
    key === 'accessTokenPrivateKey'
      ? // @ts-ignore
      Buffer.from(env.accessTokenPrivateKey, 'base64').toString('ascii')
      : // @ts-ignore
      Buffer.from(env.refreshTokenPrivateKey, 'base64').toString('ascii');
  const signToken = createSigner({
    algorithm: 'RS256',
    expiresIn: options.expiresIn,
    key: privateKey
  })
  return await signToken(payload)
};

// verify jwt
const verifyJWT = async (
  token: string,
  key: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) => {
  try {
    const publicKey =
      key === 'accessTokenPublicKey'
        ? // @ts-ignore
        Buffer.from(env.accessTokenPublicKey, 'base64').toString('ascii')
        : // @ts-ignore
        Buffer.from(env.refreshTokenPublicKey, 'base64').toString('ascii');
    const verifyToken = createVerifier({
      key: publicKey,
      cache: true,
      errorCacheTTL: tokenError => {
        // customize the ttl based on the error code
        if (tokenError.code === 'FAST_JWT_INVALID_KEY') {
          return 1000
        }
        return 2000
      }
    })
    return await verifyToken(token)
  } catch (error) {
    return null;
  }
};






// /**
//  * Generate token
//  * @param {ObjectId} userId
//  * @param {Moment} expires
//  * @param {string} type
//  * @param {string} [secret]
//  * @returns {string}
//  */
// const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
//   const payload = {
//     sub: userId,
//     iat: moment().unix(),
//     exp: expires.unix(),
//     type,
//   };
//   return jwt.sign(payload, secret);
// };

// /**
//  * Save a token
//  * @param {string} token
//  * @param {ObjectId} userId
//  * @param {Moment} expires
//  * @param {string} type
//  * @param {boolean} [blacklisted]
//  * @returns {Promise<Token>}
//  */
// const saveToken = async (token, userId, expires, type, blacklisted = false) => {
//   const tokenDoc = await Token.create({
//     token,
//     user: userId,
//     expires: expires.toDate(),
//     type,
//     blacklisted,
//   });
//   return tokenDoc;
// };

// /**
//  * Verify token and return token doc (or throw an error if it is not valid)
//  * @param {string} token
//  * @param {string} type
//  * @returns {Promise<Token>}
//  */
// const verifyToken = async (token, type) => {
//   const payload = jwt.verify(token, config.jwt.secret);
//   const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
//   if (!tokenDoc) {
//     throw new Error('Token not found');
//   }
//   return tokenDoc;
// };

// /**
//  * Generate auth tokens
//  * @param {User} user
//  * @returns {Promise<Object>}
//  */
// const generateAuthTokens = async (user) => {
//   const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
//   const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

//   const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
//   const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
//   await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

//   return {
//     access: {
//       token: accessToken,
//       expires: accessTokenExpires.toDate(),
//     },
//     refresh: {
//       token: refreshToken,
//       expires: refreshTokenExpires.toDate(),
//     },
//   };
// };

// /**
//  * Generate reset password token
//  * @param {string} email
//  * @returns {Promise<string>}
//  */
// const generateResetPasswordToken = async (email) => {
//   const user = await userService.getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
//   }
//   const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
//   const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
//   await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
//   return resetPasswordToken;
// };

// /**
//  * Generate verify email token
//  * @param {User} user
//  * @returns {Promise<string>}
//  */
// const generateVerifyEmailToken = async (user) => {
//   const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
//   const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
//   await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
//   return verifyEmailToken;
// };


// const signJwt = (
//   payload: Object,
//   key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
//   options: SignOptions = {}
// ) => {
//   const privateKey =
//     key === 'accessTokenPrivateKey'
//       ? // @ts-ignore
//         Buffer.from(env.accessTokenPrivateKey, 'base64').toString('ascii')
//       : // @ts-ignore
//         Buffer.from(env.refreshTokenPrivateKey, 'base64').toString('ascii');
//   return jwt.sign(payload, privateKey, {
//     ...(options && options),
//     algorithm: 'RS256',
//   });
// };

// // verify jwt
// const verifyJWT = <T>(
//   token: string,
//   key: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
// ): T | null => {
//   try {
//     const publicKey =
//       key === 'accessTokenPublicKey'
//         ? // @ts-ignore
//           Buffer.from(env.accessTokenPublicKey, 'base64').toString('ascii')
//         : // @ts-ignore
//           Buffer.from(env.refreshTokenPublicKey, 'base64').toString('ascii');
//     return jwt.verify(token, publicKey) as T;
//   } catch (error) {
//     return null;
//   }
// };

export { signJwt, verifyJWT };
