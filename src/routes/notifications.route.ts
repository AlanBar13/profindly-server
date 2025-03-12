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

router
  .route("/")
  .get(getAllNotifications)
  .post(validateData(notificationsSchema), sendNotification);
router.route("/user").get(requireAuth(), getUserNotifications);
router
  .route("/:id")
  .patch(notificationMarkAsRead)
  .delete(deleteNotification);

export default router;
