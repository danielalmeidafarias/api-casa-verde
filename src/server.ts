import express, { Request, Response } from "express";
import plantas from "./routes/plantas";
import promo from "./routes/promo";
import auth from "./routes/oauth";
import { PrismaClient } from "@prisma/client";
import userInfo from "./routes/userinfo";
import payment from "./routes/payment";
import pedidos from "./routes/pedidos";
import webhooks from "./routes/webhook";
import admin from "./routes/admin/admin";
import newsLetter from "./routes/newsletter";
import https from "https";
import fs from "fs";

export const prisma = new PrismaClient();

const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.get("/", (req: Request, res: Response) => {
  res.send("Servidor rodando");
});

app.use("/api", plantas);

app.use("/api", promo);

app.use("/api", newsLetter);

app.use("/api", auth);

app.use("/api", userInfo);

app.use("/api", payment);

app.use("/api", pedidos);

app.use("/api", webhooks);

app.use("/admin", admin);

app.listen(port, () => {
  console.log(`Servidor rodando da porta ${port}`);
});

https
  .createServer(
    {
      cert: fs.readFileSync("./SSL/code.crt"),
      key: fs.readFileSync("./SSL/code.key"),
    },
    app
  )
  .listen(3001, () => {
    console.log("Servidor rodando em https na porta 3001");
  });
