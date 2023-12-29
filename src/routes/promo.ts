import express, { Router, Request, Response } from "express";
import { prisma } from "../server";

const promo = Router();

promo.route("/promo").get(async (req: Request, res: Response) => {
  const promoPlantas = await prisma.planta.findMany({
    where: {
      onSale: true,
    },
  });

  res.json(promoPlantas);
});

export default promo;
