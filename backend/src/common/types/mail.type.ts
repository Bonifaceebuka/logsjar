import { SendMailOptions } from "nodemailer";

export interface CustomMailOptions extends SendMailOptions {
    template?: string;
    context?: any;
}