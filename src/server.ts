import express from "express";
import plantas from "./routes/plantas";
import promo from "./routes/promo";
import auth from "./routes/oauth";
import { PrismaClient } from "@prisma/client";
import newsLetter from "./routes/newsletter";
import userInfo from "./routes/userinfo";
import payment from "./routes/payment";
import pedidos from "./routes/pedidos";

export const prisma = new PrismaClient();

const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api", plantas);

app.use("/api", promo);

app.use("/api", newsLetter);

app.use("/api", auth);

app.use("/api", userInfo);

app.use("/api", payment);

app.use("/api", pedidos);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/api`);
});
