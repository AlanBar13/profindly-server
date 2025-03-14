import express from "express";
import { validateData } from "../middleware/validation.middleware";
import { notificationsSchema } from "../schema/notifications.schema";
import {
  sendNotification,
  getAllNotifications,
  getUserNotifications,
  deleteNotification,
  notificationMarkAsRead,
} from "../controllers/notifications.controller";
import { requireAuth } from "@clerk/express";

const router = express.Router();

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags:
 *      - Notifications
 *     responses:
 *       200:
 *         description: List of notifications
 *   post:
 *     summary: Send a notification
 *     tags:
 *      - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification sent
 */
router
  .route("/")
  .get(getAllNotifications)
  .post(validateData(notificationsSchema), sendNotification);

/**
 * @swagger
 * /api/v1/notifications/user:
 *   get:
 *     summary: Get user notifications
 *     tags:
 *      - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user notifications
 */
router.route("/user").get(requireAuth(), getUserNotifications);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   patch:
 *     summary: Mark notification as read
 *     tags:
 *      - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *   delete:
 *     summary: Delete a notification
 *     tags:
 *      - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 */
router
  .route("/:id")
  .patch(notificationMarkAsRead)
  .delete(deleteNotification);

export default router;
