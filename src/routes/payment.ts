import { Response, Request, Router } from "express";
import { TCart } from "../interfaces/ICart";
import { prisma } from "../server";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const payment = Router();

// Criar uma função para verificar se a quantidade de produto requisitada está disponível
// Se positivo, após a compra confirmada, diminuir a quantidade do produto no estoque

payment
  .route("/payment")

  .post(async (req: Request, res: Response) => {
    const cart: TCart = req.body.cart;
    const userId: string = req.body.userId

    const session = await stripe.checkout.sessions.create({
      line_items: cart.map((product) => {
        return {
          price_data: {
            currency: "brl",
            unit_amount: product.price * 100,
            product_data: {
              name: product.name,
              // images: ['https://example.com/t-shirt.png'],
            },
          },
          quantity: product.number,
        };
      }),

      mode: "payment",
      success_url: `http://localhost:5173/paymentsuccess`,
      cancel_url: `http://localhost:5173/paymentfailed`,
    });

    const pedido = await prisma.pedido.create({
      data: {
        cart: cart,
        id: session.id,
        status: session.status,
        userId: userId,
        subTotal: session.amount_total / 100,
        paymentUrl: session.url
      }
    })

    console.log(session)

    res.send({ href: session.url });
  })

export default payment;
