import { ExpoNotificationService } from "./expo-notification.service";
import { NotificationsModel } from "../models/notifications.models";
import { UserModel } from "../models/user.model";

class NotificationsService {
  private expoNotificationService: ExpoNotificationService;

  constructor() {
    this.expoNotificationService = new ExpoNotificationService();
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    user_id: string,
    type: string = "info"
  ) {
    const to = await UserModel.findOne({ notificationToken: token });
    if (!to) {
      throw new Error("Token not found on User DB");
    }

    const notification = new NotificationsModel({
      from: user_id,
      to: to._id,
      title,
      message: body,
      type,
    });
    const newNotification = await notification.save();
    await newNotification.populate({ path: "from", select: "name lastname" });

    return await this.expoNotificationService.sendPushNotification(
      token,
      title,
      body,
      newNotification
    );
  }

  async getAllNotifications() {
    return await NotificationsModel.find()
      .populate({ path: "from", select: "name lastname" })
      .populate({ path: "to", select: "name lastname" })
      .lean();
  }

  async getUserNotifications(auth_id: string) {
    const user = await UserModel.findOne({ auth_id });
    if (!user) {
      throw new Error(`${typeof NotificationsService} User not found`);
    }

    return await NotificationsModel.find({ to: user._id })
      .populate({ path: "from", select: "name lastname" })
      .populate({ path: "to", select: "name lastname" })
      .lean();
  }

  async markAsRead(id: string) {
    const notification = await NotificationsModel.findOne({
      _id: id
    });
    if (!notification) {
      throw new Error(`${typeof NotificationsService} Notification not found`);
    }

    notification.read = true;
    await notification.save();
  }

  async deleteNotification(id: string) {
    await NotificationsModel.deleteOne({ _id: id });
  }
}

export default new NotificationsService();
