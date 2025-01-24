import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";
import { getAuth } from "@clerk/express";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const existingUser = await UserModel.findOne({
    $or: [{ email: req.body.email }, { auth_id: req.body.auth_id }],
  });
  if (existingUser) {
    res.status(403);
    throw new Error("User already exist");
  }
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
    const { userId } = getAuth(req);
    console.log(userId)
    if (!userId) {
      throw new Error("Not Authenticated, failed to retreive id");
    }

    const user = await UserModel.findOne({
      auth_id: userId,
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
    user.gender = req.body.gender || user.gender;
    user.preferred_language = req.body.preferred_language || user.preferred_language;
    user.preferred_location = req.body.preferred_location || user.preferred_location;
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
