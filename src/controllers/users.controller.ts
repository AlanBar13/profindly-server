import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = new UserModel(req.body);
  await user.save();
  res.json(user);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await UserModel.find();
  res.json(users);
});

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userAuthId = req.user?.auth_id;
    if (!userAuthId) {
      throw new Error("Not Authenticated, failed to retreive id");
    }
    
    const user = await UserModel.findOne({
      auth_id: userAuthId,
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ auth_id: req.params.id });
  if (user) {
    user.name = req.body.name || user.name;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.login_type = req.body.login_type || user.login_type;
    user.auth_id = req.body.auth_id || user.auth_id;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.deleteOne({ auth_id: req.params.id });
  if (user.deletedCount > 0) {
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
