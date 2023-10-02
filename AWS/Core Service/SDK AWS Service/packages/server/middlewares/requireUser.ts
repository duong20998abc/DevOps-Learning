// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import ApiError from "../utils/api-error";
// // import { RedisClient } from "../loaders/redis";
// import { roles, ROLES } from "../../lib";
// // import { getOneSchoolService } from "../components/schools/schools.service";
// // import { getOneUser } from "../components/users/users.service";

// export async function requireUser(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (!res.locals.user) {
//     return res
//       .status(httpStatus.UNAUTHORIZED)
//       .json({ message: "Invalid token or session has expired" });
//   }
//   return next();
// }
// export async function requireTeacher(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (
//     ![ROLES.TEACHER, ROLES.SCHOOL_MANAGER, ROLES.SUPER_ADMIN, ROLES.FORM_TEACHER].includes(
//       res.locals.user?.role
//     )
//   ) {
//     throw new ApiError(
//       httpStatus.FORBIDDEN,
//       "Bạn không được quyền truy cập trang này"
//     );
//   }
//   return next();
// }
// export async function requireStudent(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (!(res.locals.user?.role === ROLES.STUDENT)) {
//     throw new ApiError(
//       httpStatus.FORBIDDEN,
//       "Bạn không được quyền truy cập trang này"
//     );
//   }
//   return next();
// }

// /*
// neu ma la schoolManager thi se find ra adminToken gan them superAdminGoogleOauthId

// */
// export async function requireSchoolManager(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (
//     ![ROLES.TEACHER, ROLES.SCHOOL_MANAGER, ROLES.SUPER_ADMIN].includes(
//       res.locals.user?.role
//     )
//   ) {
//     throw new ApiError(
//       httpStatus.FORBIDDEN,
//       "Bạn không được quyền truy cập trang này"
//     );
//   }

//   const origin = req.headers.origin?.toString() || "";

//   const school = await getOneSchoolService({
//     origin,
//   });
//   const superAdminSession =
//     (await RedisClient.get(`${origin}_superadmin`)) || null;
//   let superAdmin = superAdminSession
//     ? (JSON.parse(superAdminSession) as any)
//     : null;
//   if (!superAdmin) {
//     superAdmin = await getOneUser({
//       email: school?.superAdminEmail || "",
//     });
//   }

//   res.locals.superAdmin = {
//     ...superAdmin,
//   };

//   return next();
// }

// export async function requireFormTeacher(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (
//     ![ROLES.SCHOOL_MANAGER, ROLES.SUPER_ADMIN, ROLES.FORM_TEACHER].includes(
//       res.locals.user?.role
//     )
//   ) {
//     throw new ApiError(
//       httpStatus.FORBIDDEN,
//       "Bạn không được quyền truy cập trang này"
//     );
//   }
//   return next();
// }


// export async function requireDepartmentManager(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const rolesOfUser = res.locals.rolesOfUser as roles[];
//   if (!rolesOfUser || rolesOfUser.length === 0) {
//     throw new ApiError(
//       httpStatus.FORBIDDEN,
//       "Bạn không được quyền truy cập trang này"
//     );
//   }
//   const isIncludeDepartmentManager = rolesOfUser.some(
//     (role) => role.role === ROLES.DEPARTMENT_MANAGER
//   );
//   if (!isIncludeDepartmentManager) {
//     throw new ApiError(
//       httpStatus.FORBIDDEN,
//       "Bạn không được quyền truy cập trang này"
//     );
//   }
//   return next();
// }

// export const requireRoles =
//   (roles: string[]) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//       if (
//         [ROLES.SUPER_ADMIN, ROLES.SCHOOL_MANAGER].includes(res.locals.user?.role)
//       ) {
//         return next();
//       }
//       if (roles.includes(res.locals.user?.role)) {
//         return next();
//       }
//       throw new ApiError(
//         httpStatus.FORBIDDEN,
//         "Bạn không được quyền truy cập trang này"
//       );
//     };
