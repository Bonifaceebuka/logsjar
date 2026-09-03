import { SendMailOptions } from "nodemailer";
import path from "path"
import { create } from "express-handlebars";
import fs from "fs";
import { CONFIGS } from "../configs";
import { emailTransporter } from "../configs/mailing";
export interface CustomMailOptions extends SendMailOptions {
    template?: string;
    from: any;
    context?: any;
}


const hbs = create({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "../../views/emails/layouts"),
    partialsDir: path.join(__dirname, "../../views/emails/partials"),
    defaultLayout: "main",
})

const handlebarsInstance = hbs.handlebars as unknown as any;

export const sendEmail = async (to: string, subject: string, template: string, data: any) => {
    const templatePath = path.join(__dirname, `../../views/emails/${template}.hbs`);
    if (!fs.existsSync(templatePath)) {
        console.error(`❌ Template "${template}.hbs" not found!`);
        return;
    }

    const templateSource = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = hbs.handlebars.compile(templateSource,{})(
        {
            subject,
            ...data
        }
    );
    
    const layoutPath = path.join(__dirname, "../../views/emails/layouts/main.hbs");
    const layoutSource = fs.readFileSync(layoutPath, "utf8");

    const registerPartial = (name: string, filePath: string) => {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf8");
            handlebarsInstance.registerPartial(name, content);
        } else {
            console.error(`⚠️ Warning: ${name} partial not found!`);
        }
    };

    registerPartial("header", path.join(__dirname, "../../views/emails/partials/header.hbs"));
    registerPartial("footer", path.join(__dirname, "../../views/emails/partials/footer.hbs"));


    const compiledMailTemplate = handlebarsInstance.compile(layoutSource)({
        subject,
        body: compiledTemplate,
    });

    try {
        const mailOptions: CustomMailOptions = {
            from: {
                    email: CONFIGS.MAIL.SENDER_EMAIL,
                    name: CONFIGS.MAIL.SENDER_NAME
                },
            to,
            subject,
            template,
            html: compiledMailTemplate,
            context: data,
        };
        
        let info: any = null;

        const provider = CONFIGS.MAIL.MAIL_PROVIDER;
        switch (provider) {
            case 'sendgrid':
                // info = await sendMailWithSendgrid(mailOptions);
                break;
            default:
            info = await emailTransporter.sendMail(mailOptions);
                break;
        }

        console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};