import FormData from "form-data";
import Mailgun from "mailgun.js";
import type { IMailgunClient } from "mailgun.js/Interfaces";

class EmailSevice {
  private client: IMailgunClient;
  private domain: string = Bun.env.MAILGUN_DOMAIN || "Domain";
  private from: string = Bun.env.MAILGUN_DOMAIN_FROM || "From";
  private icon: string =
    "https://profindly.s3.us-east-2.amazonaws.com/icon.png";

  constructor() {
    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({
      username: "api",
      key: Bun.env.MAILGUN_API_KEY || "Key",
    });

    this.client = client;
  }

  async sendTestMessage() {
    try {
      const data = await this.client.messages.create(this.domain, {
        from: this.from,
        to: "", // Email(s) as string or string[]
        subject: "Hello World",
        text: "Congratulations Alan Bardales, you just sent an email with Mailgun! You are truly awesome!",
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  async sendWelcomeMessage(email: string, name: string) {
    try {
      const data = {
        icon: this.icon,
        name,
      };

      await this.client.messages.create(this.domain, {
        from: this.from,
        to: email,
        subject: "Bienvenido a Profindly",
        template: "welcome message",
        "h:X-Mailgun-Variables": JSON.stringify(data),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendSpecialistWelcomeMessage(
    email: string,
    name: string,
    prefix: string
  ) {
    try {
      const data = {
        icon: this.icon,
        name,
        prefix,
      };

      await this.client.messages.create(this.domain, {
        from: this.from,
        to: email,
        subject: "Bienvenido a Profindly",
        template: "welcome specialist",
        "h:X-Mailgun-Variables": JSON.stringify(data),
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const emailService = new EmailSevice();
export default emailService;
