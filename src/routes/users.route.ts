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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 */
router.route("/").get(getUsers).post(validateData(userSchema), createUser);

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.route("/profile").get(requireAuth(), getUserProfile);

/**
 * @swagger
 * /api/v1/users/upgradeUser:
 *   post:
 *     summary: Upgrade user to specialist
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User upgraded to specialist
 */
router.route("/upgradeUser").post(upgradeUserToSpecialist);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router
  .route("/:id")
  .patch(validateData(updatedUserSchema), updateUser)
  .delete(deleteUser);

export default router;
