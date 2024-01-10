import { Router, Response, Request } from "express";
import { prisma } from "../server";

const webhooks = Router();

webhooks
  .route(`/webhook`)
  .post(async (request: Request, response: Response) => {
    const event = request.body;

    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;
        try {
          await prisma.pedido.update({
            where: {
              id: checkoutSessionCompleted.id,
            },
            data: {
              paymentIntent: checkoutSessionCompleted.payment_intent,
            },
          });
        } catch (err) {
          console.error(err);
        }

        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        try {
          await prisma.pedido.update({
            where: {
              paymentIntent: paymentIntentSucceeded.id,
            },
            data: {
              status: `complete`,
            },
          });
        } catch (err) {
          console.error(err);
        }

        break;
      case "checkout.session.expired":
        const checkoutSessionExpired = event.data.object;
        console.log(checkoutSessionExpired)
        try {
          await prisma.pedido.update({
            where: {
              id: checkoutSessionExpired.id,
            },
            data: {
              status: `expired`,
            },
          });
        } catch (err) {
          console.error(err);
        }

        break;
      case "charge.refunded":
        const chargeRefunded = event.data.object;

        try {
          await prisma.pedido.update({
            where: {
              paymentIntent: chargeRefunded.payment_intent,
            },
            data: {
              status: "expired",
            },
          });
        } catch (err) {
          console.error(err);
        }

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send();
  });

export default webhooks;
