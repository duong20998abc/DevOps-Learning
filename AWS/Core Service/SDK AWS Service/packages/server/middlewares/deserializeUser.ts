import { NextFunction, Request, Response } from "express";
import { getSession } from "../utils/session";
import { verifyJWT } from "../utils/jwt.utils";
import env from "../configs/env";
// import { SessionInformation } from "../interfaces";
import httpStatus from "http-status";
import ApiError from "../utils/api-error";

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let access_token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    access_token = req.headers.authorization.split(" ")[1];
  }
  if (!access_token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Bạn chưa đăng nhập. Mời đăng nhập lại."));
  }

  const decoded = await verifyJWT(access_token, "accessTokenPublicKey") as any;
  // console.log("🚀 ~ file: deserializeUser.ts:26 ~ decoded", decoded)

  const origin = req.headers.origin || 'http://localhost:3000';

  if (!decoded || !origin || decoded.origin !== origin) {
    return next(
      new ApiError(
        httpStatus.UNAUTHORIZED,
        `Người dùng không hợp lệ`
      )
    );
  }

  res.locals.user = {
    ...decoded,
  };
  return next();
}
