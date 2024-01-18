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
      res.status(422).send({ message: "email faltando" });
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
        return res.status(409).send({ message: "Email ja cadastrado" });
      } else {
        try {
          sendEmail(transporter, mailOptions)
            .then(async () => {
              try {
                await prisma.newsLetterEmail.create({
                  data: {
                    email: email,
                  },
                });
              } catch (err) {
                console.error(err);
                return res.status(400).send(err);
              }
            })
            .then(() => {
              return res
                .status(200)
                .send({ message: "Email registrado com sucesso" });
            });
        } catch (err) {
          console.error(err);
          return res.status(400).send(err);
        }
      }
    }
  })
  .delete(async (req: Request, res: Response) => {
    const email = req.body.email;

    if (!email) {
      res.status(422).send({ message: "email faltando" });
    } else {
      if (
        !(await prisma.newsLetterEmail.findUnique({
          where: {
            email: email,
          },
        }))
      ) {
        return res.status(406).send({ message: "Email nao cadastrado" });
      } else {
        try {
          await prisma.newsLetterEmail
            .delete({
              where: {
                email: email,
              },
            })
            .then(() => {
              return res
                .status(200)
                .send({ message: "Email excluido com sucesso" });
            });
        } catch (err) {
          console.error(err);
          return res.status(400).send(err);
        }
      }
    }
  });

export default newsLetter;
