import { ExpoNotificationService } from "./expo-notification.service";
import { NotificationsModel } from "../models/notifications.models";
import { UserModel } from "../models/user.model";
import { ServicesModel } from "../models/services.model";

class NotificationsService {
  private expoNotificationService: ExpoNotificationService;

  constructor() {
    this.expoNotificationService = new ExpoNotificationService();
  }

  /**
   * Sends a notification to a user identified by the given token.
   *
   * @param {string} token - The notification token of the recipient user.
   * @param {string} title - The title of the notification.
   * @param {string} body - The body message of the notification.
   * @param {string} user_id - The ID of the user sending the notification.
   * @param {string} [type="info"] - The type of the notification (default is "info").
   * @returns {Promise<any>} - A promise that resolves when the notification is sent.
   * @throws {Error} - Throws an error if the token is not found in the User DB.
   */
  async sendNotification(
    token: string,
    title: string,
    body: string,
    user_id: string,
    type: string = "info",
    bookingId?: string,
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
      booking: bookingId,
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

  /**
   * Sends a notification by service.
   *
   * @param serviceId - The ID of the service.
   * @param title - The title of the notification.
   * @param body - The body content of the notification.
   * @param user_id - The ID of the user sending the notification.
   * @param type - The type of the notification (default is "info").
   * @param bookingId - The ID of the booking (optional).
   * @returns A promise that resolves when the notification is sent.
   * @throws Will throw an error if the service is not found.
   */
  async sendNotificationByService(
    serviceId: string,
    title: string,
    body: string,
    user_id: string,
    type: string = "info",
    bookingId?: string
  ) {
    const service = await ServicesModel.findOne({
      _id: serviceId,
    })
      .populate({
        path: "specialist",
        select: "user prefix",
        populate: { path: "user", select: "notificationToken" },
      })
      .lean();
    if (!service) {
      throw new Error("Service not found");
    }
    const specialist = service.specialist as any;
    const user = specialist.user as any;
    const token = user.notificationToken;

    const notification = new NotificationsModel({
      from: user_id,
      to: user._id,
      title,
      message: body,
      type,
      booking: bookingId,
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
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
  }

  async getNotification(id: string) {
    return await NotificationsModel.findOne({ _id: id })
      .populate({ path: "from", select: "name lastname notificationToken" })
      .populate({ path: "to", select: "name lastname notificationToken" })
      .populate({ path: "booking" })
      .lean();
  }

  async markAsRead(id: string) {
    const notification = await NotificationsModel.findOne({
      _id: id,
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
