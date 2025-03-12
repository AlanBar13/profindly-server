import express from "express";
import { validateData } from "../middleware/validation.middleware";
import { requireAuth } from "@clerk/express";
import { userSchema, updatedUserSchema } from "../schema/user.schema";
import {
  createUser,
  getUsers,
  getUserProfile,
  updateUser,
  deleteUser,
  upgradeUserToSpecialist,
} from "../controllers/users.controller";

const router = express.Router();

router.route("/").get(getUsers).post(validateData(userSchema), createUser);
router.route("/profile").get(requireAuth(), getUserProfile);
router.route("/upgradeUser").post(upgradeUserToSpecialist);
router
  .route("/:id")
  .patch(validateData(updatedUserSchema), updateUser)
  .delete(deleteUser);

export default router;
