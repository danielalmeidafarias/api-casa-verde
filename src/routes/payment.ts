import { Response, Request, Router } from "express";
import { TCart } from "../interfaces/ICart";
import { prisma } from "../server";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const payment = Router();

payment.route("/payment").post(async (req: Request, res: Response) => {
  const cart: TCart = req.body.cart;
  const userId: string = req.body.userId;

  let available: boolean = true;

  const estoque = await prisma.planta.findMany();

  cart.forEach((produto) => {
    const produtoEstoque = estoque.filter((produtoEstoque) => {
      return produtoEstoque.id === produto.id;
    })[0];

    if (
      produtoEstoque &&
      produtoEstoque.tempNumber < produto.number &&
      available
    ) {
      available = false;
      const filteredCart = Array.from(cart, (product) => {
        if (product.id === produtoEstoque.id && !available) {
          return {
            id: produtoEstoque.id,
            name: produtoEstoque.name,
            price: produtoEstoque.price,
            number: produtoEstoque.tempNumber,
          };
        } else {
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            number: product.number,
          };
        }
      }).filter((product) => product.number > 0);
      return res.status(409).send({ produtoEstoque, filteredCart });
    }
  });

  if (available) {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: cart.map((product) => {
          return {
            price_data: {
              currency: "brl",
              unit_amount: product.price * 100,
              product_data: {
                name: product.name,
              },
            },
            quantity: product.number,
          };
        }),

        mode: "payment",
        success_url: `https://casa-verde-alpha-seven.vercel.app/paymentsuccess`,
        cancel_url: `https://casa-verde-alpha-seven.vercel.app/paymentfailed`,
      });

      await prisma.pedido.create({
        data: {
          cart: cart,
          id: session.id,
          status: session.status,
          userId: userId,
          subTotal: session.amount_total / 100,
          paymentUrl: session.url,
          paymentIntent: undefined,
        },
      });

      for (let product of cart) {
        await prisma.planta.update({
          where: {
            id: product.id,
          },
          data: {
            tempNumber: {
              decrement: product.number,
            },
          },
        });
      }

      return res.send({ href: session.url });
    } catch (err) {
      return res.send(err).status(400);
    }
  }
});

export default payment;
