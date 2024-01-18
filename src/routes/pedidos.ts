import { Response, Request, Router } from "express";
import { prisma } from "../server";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const pedidos = Router();

pedidos.route("/pedidos/:userId").get(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(422).send({ message: "userId faltando" });
  } else {
    try {
      let pedidos = await prisma.pedido.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          date: "desc",
        },
      });

      return res.send(pedidos);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }
});

pedidos
  .route(`/pedidos/:userId/cancel`)
  .put(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const session_id = req.body.session_id;

    if (!userId) {
      return res.status(422).send({ message: "UserId faltando" });
    } else if (!session_id) {
      return res.status(422).send({ message: "Id do pedido faltando" });
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

        return res
          .status(200)
          .send({ message: "Pedido cancelado com sucesso" });
      } catch (err) {
        return res.status(400).send(err);
      }
    }
  });

pedidos
  .route(`/pedidos/:userId/refound`)
  .put(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const payment_intent = req.body.payment_intent;

    if (!userId) {
      return res.status(400).send({ message: "id de usuário faltando" });
    } else if (!payment_intent) {
      return res.status(400).send({ message: "id de pagamento faltando" });
    } else {
      try {
        await stripe.refunds.create({
          payment_intent: payment_intent,
        });

        return res
          .status(200)
          .send({ message: "Pedido de reembolso feito com sucesso" });
      } catch (err) {
        res.status(400).send(err);
      }
    }
  });

export default pedidos;
