import nodemailer from "nodemailer";
import ejs from "ejs";
import htmlToText from "html-to-text";
import { IEmailCreation } from "../../interfaces/services/emails/emailCreationInterface";
import { IProvisionalUser } from "../../interfaces/models/user/provisionalUserInterface";
import { IUser } from "../../interfaces/models/user/userInterface";
import path from "path";

export default class Email implements IEmailCreation {
  to: string;
  firstname: string;
  lastname: string;
  url: string;
  from: string;
  message?: string;
  otherData: any;

  constructor(
    user: IUser | IProvisionalUser,
    url: string,
    message?: string,
    otherData?: any
  ) {
    this.to = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.url = url;
    this.from = `Job Success <${
      process.env.EMAIL_USERNAME ?? "no-reply@kit-rh.com"
    }>`;
    this.message = message; // todo in future : delete ton use HTML template with message in the template directly
    this.otherData = otherData;
  }

  newTransport(): nodemailer.Transporter {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USERNAME,
          clientId: process.env.EMAIL_OAUTH_CLIENTID,
          clientSecret: process.env.EMAIL_OAUTH_CLIENT_SECRET,
          refreshToken: process.env.EMAIL_OAUTH_REFRESH_TOKEN,
          accessToken: process.env.EMAIL_OAUTH_ACCESS_TOKEN,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: "mailhog",
        port: 1025,
      });
    }
  }

  async send(template: string, subject: string): Promise<void> {
    const pathToTemplate = path.join(
      __dirname,
      "/../../views/pages/emails/",
      template + ".ejs"
    );

    // générer le html avec le template et les variables
    const html = await ejs.renderFile(pathToTemplate, {
      title: subject,
      firstname: this.firstname,
      lastname: this.lastname,
      url: this.url,
      message: this.message,
      otherData: this.otherData,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.convert(html), // le html est converti en texte pour l'envoi
      html,
    };

    try {
      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      console.log("Error sending mail from service:", error);
      throw new Error();
    }
  }

  async sendWelcome(): Promise<void> {
    await this.send("welcome", "Bienvenue sur WildCarbon !");
  }

  async sendPasswordReset(): Promise<void> {
    await this.send(
      "reset-password",
      "Réinitialisez votre mot de passe WildCarbon"
    );
  }
}
