import { Expo } from "expo-server-sdk";

export class ExpoNotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo({ accessToken: Bun.env.EXPO_ACCESS_TOKEN });
  }

  async sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string,
    data: any
  ) {
    const chunks = this.expo.chunkPushNotifications([
      { to: expoPushToken, title, body, data },
    ]);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }

    let response = "";
    for (const ticket of tickets) {
      if (ticket.status === "error") {
        if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
          response = "DeviceNotRegistered";
        }
      }

      if (ticket.status === "ok") {
        response = ticket.id;
      }
    }

    return response;
  }
}
