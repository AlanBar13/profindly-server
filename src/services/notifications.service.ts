import { ExpoNotificationService } from "./expo-notification.service";
import { prisma } from "../config/prisma";
import { NotificationType } from "../generated/prisma/client";

class NotificationsService {
  private expoNotificationService: ExpoNotificationService;

  constructor() {
    this.expoNotificationService = new ExpoNotificationService();
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    user_id: number,
    type: string = "INFO",
    bookingId?: string,
  ) {
    const to = await prisma.user.findFirst({ where: { notificationToken: token } });
    if (!to) {
      throw new Error("Token not found on User DB");
    }

    const notification = await prisma.notification.create({
      data: {
        fromId: user_id,
        toId: to.id,
        title,
        message: body,
        type: type as any,
        bookingId: bookingId ? parseInt(bookingId) : undefined,
      },
      include: {
        from: { select: { name: true, lastname: true } },
      },
    });

    console.log("Notification created:", notification);
    return await this.expoNotificationService.sendPushNotification(
      token,
      title,
      body,
      {fromId: user_id, toId: to.id, title, message: body, type, }
    );
  }

  async sendNotificationByService(
    serviceId: string,
    title: string,
    body: string,
    user_id: string,
    type: string = "INFO",
    bookingId?: string
  ) {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
      include: {
        specialist: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!service || !service.specialist || !service.specialist.user) {
      throw new Error("Service or specialist not found");
    }
    const user = service.specialist.user;
    const token = user.notificationToken;

    let notificationType: NotificationType;
    switch (type) {
      case "action":
        notificationType = "ACTION";
        break;
      case "alert":
        notificationType = "ALERT";
        break;
      case "message":
        notificationType = "MESSAGE";
        break;
      default:
        notificationType = "INFO";
    }

    const notification = await prisma.notification.create({
      data: {
        fromId: parseInt(user_id),
        toId: user.id,
        title,
        message: body,
        type: notificationType,
        bookingId: bookingId ? parseInt(bookingId) : undefined,
      },
      include: {
        from: { select: { name: true, lastname: true } },
      },
    });

    return await this.expoNotificationService.sendPushNotification(
      token!,
      title,
      body,
      notification
    );
  }

  async getAllNotifications() {
    return await prisma.notification.findMany({
      include: {
        from: { select: { name: true, lastname: true } },
        to: { select: { name: true, lastname: true } },
      },
    });
  }

  async getUserNotifications(auth_id: string) {
    const user = await prisma.user.findFirst({ where: { authId: auth_id } });
    if (!user) {
      throw new Error(`${typeof NotificationsService} User not found`);
    }

    return await prisma.notification.findMany({
      where: { toId: user.id },
      include: {
        from: { select: { name: true, lastname: true } },
        to: { select: { name: true, lastname: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }

  async getNotification(id: string) {
    return await prisma.notification.findUnique({
      where: { id: parseInt(id) },
      include: {
        from: { select: { name: true, lastname: true, notificationToken: true } },
        to: { select: { name: true, lastname: true, notificationToken: true } },
        booking: true,
      },
    });
  }

  async markAsRead(id: string) {
    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });
  }

  async deleteNotification(id: string) {
    await prisma.notification.delete({ where: { id: parseInt(id) } });
  }
}

export default new NotificationsService();
