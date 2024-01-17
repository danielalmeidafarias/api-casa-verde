import express, { Router, Request, Response } from "express";
import { prisma } from "../server";

const promo = Router();

promo.route("/promo").get(async (req: Request, res: Response) => {
  try {
    const promoPlantas = await prisma.planta.findMany({
      where: {
        onSale: true,
      },
    });

    return res.json(promoPlantas);
  } catch (err) {
    return res.send(err).status(400);
  }
});

export default promo;
