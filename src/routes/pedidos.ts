import { Response, Request, Router } from "express";
import { TCart } from "../interfaces/ICart";
import { prisma } from "../server";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const pedidos = Router();

pedidos.route("/pedidos/:userId").get(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const pedidos = await prisma.pedido.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true
    },
  });

  res.send(pedidos);
});

pedidos.route("/pedidos/:userId/:session_id").get(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const session_id = req.params.session_id;

  const session = await stripe.checkout.sessions.retrieve(session_id);

  // const session = await stripe.checkout.sessions.expire(session_id);

  const pedido = await prisma.pedido.findUnique({
    where: {
      id: session_id,
      userId: userId,
    },
  })

  if (pedido?.status !== session.status) {
    const pedido = await prisma.pedido.update({
      where: {
        id: session_id,
        userId: userId,
      },
      data: {
        status: session.status,
      },
    });
  }

  // await prisma.pedido.deleteMany({
  //   where: {
  //     userId: userId
  //   }
  // })

  res.send(pedido);
});

export default pedidos;
