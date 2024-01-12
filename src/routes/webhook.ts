import { Router, Response, Request } from "express";
import { prisma } from "../server";
import { TCart } from "../interfaces/ICart";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const webhooks = Router();

webhooks
  .route(`/webhook`)
  .post(async (request: Request, response: Response) => {
    const event = request.body;

    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;
        const paymentIntent = await stripe.paymentIntents.retrieve(
          checkoutSessionCompleted.payment_intent
        );

        try {
          if (paymentIntent.status === `succeeded`) {
            const checkoutSessionPedido = await prisma.pedido.update({
              where: {
                id: checkoutSessionCompleted.id,
              },
              data: {
                paymentIntent: checkoutSessionCompleted.payment_intent,
                status: `complete`,
              },
            });

            const cart: TCart = JSON.parse(
              JSON.stringify(checkoutSessionPedido.cart)
            );

            for (let product of cart) {
              await prisma.planta.update({
                where: {
                  id: product.id,
                },
                data: {
                  number: {
                    decrement: product.number,
                  },
                },
              });
            }
          } else {
            await prisma.pedido.update({
              where: {
                id: checkoutSessionCompleted.id,
              },
              data: {
                paymentIntent: checkoutSessionCompleted.payment_intent,
              },
            });
          }
        } catch (err) {
          console.error(err);
        }

        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        try {
          const pedidoIntendPayment = await prisma.pedido.findUnique({
            where: {
              paymentIntent: paymentIntentSucceeded.id,
            },
          });

          if (pedidoIntendPayment) {
            await prisma.pedido.update({
              where: {
                paymentIntent: paymentIntentSucceeded.id,
              },
              data: {
                status: `complete`,
              },
            });

            const cart: TCart = JSON.parse(
              JSON.stringify(pedidoIntendPayment.cart)
            );

            for (let product of cart) {
              await prisma.planta.update({
                where: {
                  id: product.id,
                },
                data: {
                  number: {
                    decrement: product.number,
                  },
                },
              });
            }
          }
        } catch (err) {
          console.error(err);
        }

        break;
      case "checkout.session.expired":
        const checkoutSessionExpired = event.data.object;
        console.log(checkoutSessionExpired);
        try {
          const expiredPedido = await prisma.pedido.update({
            where: {
              id: checkoutSessionExpired.id,
            },
            data: {
              status: `expired`,
            },
          });

          const cart: TCart = JSON.parse(JSON.stringify(expiredPedido.cart));

          for (let product of cart) {
            await prisma.planta.update({
              where: {
                id: product.id,
              },
              data: {
                tempNumber: {
                  increment: product.number,
                },
              },
            });
          }
        } catch (err) {
          console.error(err);
        }

        break;
      case "charge.refunded":
        const chargeRefunded = event.data.object;

        try {
          const chargedPedido = await prisma.pedido.update({
            where: {
              paymentIntent: chargeRefunded.payment_intent,
            },
            data: {
              status: "expired",
            },
          });

          const cart: TCart = JSON.parse(JSON.stringify(chargedPedido.cart));

          for (let product of cart) {
            await prisma.planta.update({
              where: {
                id: product.id,
              },
              data: {
                tempNumber: {
                  increment: product.number,
                },
                number: {
                  increment: product.number,
                },
              },
            });
          }
        } catch (err) {
          console.error(err);
        }

        break;
      default:
        null;
    }

    response.send();
  });

export default webhooks;
