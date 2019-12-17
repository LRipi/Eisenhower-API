import nodemailer from 'nodemailer';
import * as path from "path";
import * as fs from "fs";

export = class Gmail {
    private readonly email: string;
    private transporter: nodemailer.Transporter;
    private template: string;
    constructor(email: string) {
        this.email = email;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "apothicare.noreply@gmail.com",
                pass: "ApothiCare2021"
            }
        });
        this.template = fs.readFileSync(path.join(__dirname, '../public/ApothiCare_mail_template.html')).toString();
    }

    modifyTemplate(subject: string, content: string, link: string, contentLink: string): nodemailer.SendMailOptions {
        this.template = this.template.replace(/%%INSERT_TITLE%%/gm, "ApothiCare.io");
        this.template = this.template.replace(/%%HEADER%%/gm, subject);
        this.template = this.template.replace(/%%INSERT_NAME%%/gm, this.email);
        this.template = this.template.replace(/%%INSERT_CONTENT_TEXT%%/gm, content);
        this.template = this.template.replace(/%%INSERT_HTML_LINK%%/gm, link);
        this.template = this.template.replace(/%%INSERT_HTML_CONTENT_LINK%%/gm, contentLink);
        this.template = this.template.replace(/%%INSERT_COMPANY%%/gm, "ApothiCare.io");
        return {
            from: '"ApothiCare.io" <apothicare.noreply@gmail.com>',
            to: this.email,
            subject: subject,
            html: this.template
        };
    }

    sendMail(options: nodemailer.SendMailOptions): void {
        this.transporter.sendMail(options, (error: any, info: nodemailer.SentMessageInfo) => {
            if (error) return console.log(error);
            else return console.log('Message sent: %s', info.messageId)
        })
    }

    sendRecuperationPassword(code: string): void {
        const subject: string = 'ApothiCare.io | Récupération de mot de passe.';
        const content: string = "Vous avez demandé à récupérer votre mot de passe ?\n\nCliquez sur le lien juste en dessous pour créer un nouveaux mot de passe !";
        const contentLink: string = "Récupérez votre mot de passe !";
        const options: nodemailer.SendMailOptions = this.modifyTemplate(subject, content, code, contentLink);
        this.sendMail(options);
    }

    sendEmailConfirmation(code: string): void {
        const subject: string = 'ApothiCare.io | Confirmation de l\'adresse mail.';
        const content: string = "Bienvenue sur ApothiCare !\n\nVous pouvez dès à présent confirmer votre adresse mail en cliquant sur le lien juste en-dessous !";
        const contentLink: string = "Activez votre compte !";
        const options: nodemailer.SendMailOptions = this.modifyTemplate(subject, content, code, contentLink);
        this.sendMail(options);
    }
};
