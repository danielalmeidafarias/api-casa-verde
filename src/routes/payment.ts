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
    const userId: string = req.body.userId;

    let verifyEstoque: boolean = false;

    const estoque = await prisma.planta.findMany();

    cart.forEach((produto) => {
      const estoqueFiltrado = estoque.filter(produtoEstoque => {
        return produtoEstoque.id === produto.id
      })[0]

      if (estoqueFiltrado && estoqueFiltrado.number < produto.number) {
        verifyEstoque = true;
        console.log(produto.number);
        console.log(estoqueFiltrado?.number, produto.name);
      }
    });

    if (!verifyEstoque) {
      console.log(verifyEstoque);

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
        success_url: `http://localhost:5173/paymentsuccess`,
        cancel_url: `http://localhost:5173/paymentfailed`,
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

      res.send({ href: session.url });
    } else {
      res.status(400).send();
    }
  });

export default payment;
