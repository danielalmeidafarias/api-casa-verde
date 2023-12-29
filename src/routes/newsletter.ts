import { Request, Response, Router } from "express";
import { prisma } from "../server";
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
  .route("/newsletter")
  .get(async (req: Request, res: Response) => {
    const allEmails = await prisma.newsLetterEmail.findMany();

    res.send(allEmails);
  })
  .post(async (req: Request, res: Response) => {
    const email = req.body.email;

    const mailOptions = {
      from: {
        name: "Casa Verde",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "Olá",
      text: "Seja bem vindo à Casa Verde",
      html: `
      <h1>Seja bem vindo ao newsletter da Casa Verde!</h1>
      <h2>O maior e-commerce verde do país</h2>
      <h4>Estamos muito felizes em te ver por aqui!</h4>
      <p>Aqui você encontra as maiores novidades do mundo Verde</p>
      <p>Além disso fique por dentro dos melhores preços de promoções incríveis!</p>
      `,
    };

    if (
      await prisma.newsLetterEmail.findUnique({
        where: {
          email: email,
        },
      })
    ) {
      res.sendStatus(409);
      return;
    } else {
      try {
        sendEmail(transporter, mailOptions).then(async () => {
          await prisma.newsLetterEmail.create({
            data: {
              email: email,
            },
          });
        });
      } catch (err) {
        console.error(err);
        res.send(err);
      }
    }
  })
  .delete(async (req: Request, res: Response) => {
    const email = req.body.email;

    if (
      !(await prisma.newsLetterEmail.findUnique({
        where: {
          email: email,
        },
      }))
    ) {
      res.sendStatus(406);
    } else {
      await prisma.newsLetterEmail.delete({
        where: {
          email: email,
        },
      });
    }
  });

newsLetter
  .route("/newsletter/send")
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
