import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import notificationsService from "../services/notifications.service";
import { getAuth } from "@clerk/express";

export const sendNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, title, body, user_id, type } = req.body;
    const message = await notificationsService.sendNotification(
      token,
      title,
      body,
      user_id,
      type
    );
    res.json({ message });
  }
);

export const getAllNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await notificationsService.getAllNotifications();
    res.json(notifications);
  }
);

export const getUserNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const notifications = await notificationsService.getUserNotifications(userId);
    res.json(notifications);
  }
);

export const notificationMarkAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    await notificationsService.markAsRead(id);
    res.json({ "message": `Notification ${id} mark as read` })
  }
);

export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    await notificationsService.deleteNotification(req.params.id);
    res.json({ message: "Notification deleted" });
  }
);
