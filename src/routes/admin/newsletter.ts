import { Request, Response, Router } from "express";
import { prisma } from "../../server";
const nodemailer = require("nodemailer");

const newsLetter = Router();

const transporter = nodemailer.createTransport({
  service: "outlook",
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (transporter: any, mailOptions: any) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email enviado com sucesso");
  } catch (err) {
    console.error(err);
  }
};

newsLetter
  .route("/newsletter/send")
  .get(async (req: Request, res: Response) => {
    res.sendStatus(200)
  })
  .post(async (req: Request, res: Response) => {
    const emails = Array.from(
      await prisma.newsLetterEmail.findMany(),
      (email) => {
        return email.email;
      }
    );

    const subject = req.body.subject;
    const text = req.body?.text;
    const html = req.body?.html;

    const mailOptions = {
      from: {
        name: "Casa Verde",
        address: process.env.EMAIL,
      },
      to: emails,
      subject: subject,
      text: text,
      html: html,
    };

    try {
      sendEmail(transporter, mailOptions);
      res.sendStatus(200);
    } catch (err) {
      res.send(err);
      console.error(err);
    }
  });

export default newsLetter;
