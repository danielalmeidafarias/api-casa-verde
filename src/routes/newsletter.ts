import { Request, Response, Router } from "express";
import { prisma } from "../server";
const nodemailer = require('nodemailer')

const newsLetter = Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'danielalmeidafarias2002@gmail.com',
    pass: 'DA@almeida1234'
  }
})



newsLetter
  .route("/newsletter")
  .get(async (req: Request, res: Response) => {
    const allEmails = await prisma.newsLetterEmail.findMany();

    res.send(allEmails);
  })
  .post(async (req: Request, res: Response) => {
    const email = req.body.email;

    if (
      await prisma.newsLetterEmail.findUnique({
        where: {
          email: email,
        },
      })
    ) {
      res.sendStatus(409);
      return
    } else {
      await prisma.newsLetterEmail.create({
        data: {
          email: email
        }
      })
    }

    const mailOptions = {
      from: {
        name: 'Casa Verde',
        address: 'danielalmeidafarias2002@gmail.com'
      },
      to: email,
      subject: 'Hello',
      text: 'Hello world',
      html: `<p>Hello${email}!</p>`
    }

    const sendEmail = async (transporter: any, mailOptions: any) => {
      try {
        await transporter.sendMail(mailOptions)
        console.log('Email enviado com sucesso')
      } catch (err) {
        console.error(err)
      }
    }

    sendEmail(transporter, mailOptions)

  })
  .delete(async (req: Request, res: Response) => {

    const email = req.body.email

    if(
      !await prisma.newsLetterEmail.findUnique({
        where: {
          email: email
        }
      })
    ) {
      res.sendStatus(406)
    } else {
      await prisma.newsLetterEmail.delete({
        where: {
          email: email
        }
      })
    }

  })

newsLetter.route('/newsletter/send')
  .post(async (req: Request, res: Response) => {

  })

export default newsLetter