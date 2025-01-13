import express from "express";
import { validateData } from "../middleware/validation.middleware";
import { userSchema, updatedUserSchema } from "../schema/user.schema";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller";

const router = express.Router();

router.route("/").get(getUsers).post(validateData(userSchema), createUser);
router
  .route("/:id")
  .get(getUser)
  .patch(validateData(updatedUserSchema), updateUser)
  .delete(deleteUser);

export default router;
