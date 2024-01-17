import { Response, Request, Router } from "express";
import { TCart } from "../interfaces/ICart";
import { prisma } from "../server";
import { IPedido } from "../interfaces/IPedido";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const pedidos = Router();

pedidos.route("/pedidos/:userId").get(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  let pedidos = await prisma.pedido.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  return res.send(pedidos);
});

pedidos
  .route(`/pedidos/:userId/cancel`)
  .put(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const session_id = req.body.session_id;

    if (!userId || !session_id) {
      return res.sendStatus(422);
    } else {
      try {
        await stripe.checkout.sessions.expire(session_id);

        await prisma.pedido.update({
          where: {
            userId: userId,
            id: session_id,
          },
          data: {
            status: `expired`,
          },
        });

        return res.sendStatus(200);
      } catch (err) {
        return res.send(err).status(400);
      }
    }
  });

pedidos
  .route(`/pedidos/:userId/refound`)
  .put(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const payment_intent = req.body.payment_intent;

    if (!userId || !payment_intent) {
      return res.sendStatus(400);
    } else {
      try {
        await stripe.refunds.create({
          payment_intent: payment_intent,
        });

        return res.sendStatus(200);
      } catch (err) {
        res.send(err).status(400);
      }
    }
  });

export default pedidos;
