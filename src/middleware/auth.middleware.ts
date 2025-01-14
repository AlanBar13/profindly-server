import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";

export const protectRoutes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, Bun.env.JWT_SECRET ?? "") as any;
        const auth_id: string = decoded.sub;
        const user = await UserModel.findOne({ auth_id });
        if (!user) {
          res.status(401);
          throw new Error("Not autorized, User not found");
        }
        req.user = user;
        console.log(user);
        next();
      } catch (error) {
        res.status(401);
        throw new Error(`Not Authorized, token failed`);
      }
    } else {
      res.status(401);
      throw new Error(`Not Authorized, no authorization header`);
    }

    if (!token) {
      res.status(401);
      throw new Error("Not Authorized, no token");
    }
  }
);
