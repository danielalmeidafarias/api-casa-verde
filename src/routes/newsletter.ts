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
  } catch (err) {
    console.error(err);
  }
};

newsLetter
  .route("/newsletter")
  .post(async (req: Request, res: Response) => {
    const email = req.body.email;

    if (!email) {
      res.json({ message: "email faltando" }).status(422);
    } else {
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
        return res.json({message: "Email ja cadastrado"}).status(409);
        
      } else {
        try {
          sendEmail(transporter, mailOptions).then(async () => {
            await prisma.newsLetterEmail.create({
              data: {
                email: email,
              },
            });
          }).then(() => {
           return res.sendStatus(200)
          }).catch(err => {
           return res.sendStatus(400)
          });
        } catch (err) {
          console.error(err);
          return res.sendStatus(400);
        }
      }
    }
  })
  .delete(async (req: Request, res: Response) => {
    const email = req.body.email;

    if (!email) {
      res.json({ message: "email faltando" }).status(422);
    } else {
      if (
        !(await prisma.newsLetterEmail.findUnique({
          where: {
            email: email,
          },
        }))
      ) {
        return res.sendStatus(406);
      } else {
        await prisma.newsLetterEmail.delete({
          where: {
            email: email,
          },
        }).then(() => {
          return res.sendStatus(200)
        })
      }
    }
  });

export default newsLetter;
