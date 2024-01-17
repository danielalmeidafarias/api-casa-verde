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
  } catch (err) {
    console.error(err);
  }
};

newsLetter
  .route("/newsletter/send")
  .get(async (req: Request, res: Response) => {
    try {
      const allEmails = await prisma.newsLetterEmail.findMany();
      res.json(allEmails).status(200);
    } catch (err) {
      return res.send(err).status(400);
    }
  })
  .post(async (req: Request, res: Response) => {
    const subject = req.body.subject;
    const text = req.body?.text;
    const html = req.body?.html;

    if (!subject || (!text && !html)) {
      return res.sendStatus(422);
    } else {
      try {
        const emails = Array.from(
          await prisma.newsLetterEmail.findMany(),
          (email) => {
            return email.email;
          }
        );

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

        sendEmail(transporter, mailOptions);
        return res.sendStatus(200);
      } catch (err) {
        return res.send(err).status(400);
        console.error(err);
      }
    }
  });

export default newsLetter;
