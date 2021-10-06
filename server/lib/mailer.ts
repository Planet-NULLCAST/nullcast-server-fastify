import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class MailerClass {
    private transporter: Transporter;

    constructor() {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }

    public async sendMail(mailContent: SendMailOptions) {
      try {
        const data = await this.transporter.sendMail(mailContent);
        return data;
      } catch (error) {
        console.log('Error in util', error);
        throw error;
      }
    }
}

const mailer = new MailerClass();

export default mailer;

