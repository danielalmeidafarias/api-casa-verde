import { Request, Response, Router } from "express";
// import { UserRefreshClient } from "google-auth-library";
const nodemailer = require("nodemailer");

const express = require("express");
const { OAuth2Client } = require("google-auth-library");

const oauth = Router();

oauth.use(express.json());

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage",
  );

oauth.post("/oauth", async (req: Request, res: Response) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code);
  
  console.log(tokens)

  const email = await req.body.email;
  const accessToken = tokens.access_token;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken,
      
    },
    tls: {
      rejectUnauthorized: false,
    },
  });


  // O access token serve apenas para quem está mandando o email
  // 1 - Criar banco de dados com os emails registrados para email
  // 2 - Criar página adm para enviar email aos emails cadastrados
  // 3 - Criar requisição de envio de email assim que o usuario assinar a newsletter
  // 4 - Criar automação para envio de emails com as ofertas semanalmente
  // 5 - Pesquisar mais sobre o uso o GoogleOauth2 para login
  // 6 - Depois de aprender como utilizar o oauth para criar usuários criar carrinho de compras

  transporter.sendMail(
    {
      from: "danielalmeidafarias2002@gmail.com",
      to: [email, "danielalmeidafarias2002@gmail.com"],
      subjects: "Obrigado por se inscrever na Casa Verde",
      html: 
      `
        <h1>Bem vindo ao NewsLetter da Casa Verde</h1>
        <h3>O maior e-commerce verde do Brasil</h3>
        <p>Acompanhe nossa promoções e novidades do mundo verde direto de seu email!</p>
    `,
    },
    (err: any, data: any) => {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );

  res.json(tokens);
});

// oauth.post('/auth/google/refresh-token', async (req: Request, res: Response) => {
//   const user = new UserRefreshClient(
//     clientId,
//     clientSecret,
//     req.body.refreshToken,
//   );
//   const { credentials } = await user.refreshAccessToken(); // optain new tokens
//   res.json(credentials);
// })

export default oauth;
