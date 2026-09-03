import { CONFIGS } from ".";
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const emailTransporter = nodemailer.createTransport({
    host: CONFIGS.MAIL.MAIL_HOST,
    port: CONFIGS.MAIL.MAIL_PORT as unknown as number,
    secure: CONFIGS.MAIL.MAIL_SECURE,
    auth: {
        user: `${CONFIGS.MAIL.MAIL_USERNAME}`,
        pass: `${CONFIGS.MAIL.MAIL_PASSWORD}`
    },
    tls: {
        rejectUnauthorized: false,
      },
} as SMTPTransport.Options);