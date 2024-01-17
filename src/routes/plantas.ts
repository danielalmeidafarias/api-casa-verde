import { Planta } from "./../interfaces/Planta";
import { Router, Request, Response } from "express";
import { prisma } from "../server";

const plantas = Router();

plantas.route("/plantas").get(async (req: Request, res: Response) => {
  try {
    const todasPlantas = await prisma.planta.findMany({
      where: {
        NOT: {
          tempNumber: 0,
        },
      },
      select: {
        id: true,
        image: true,
        name: true,
        onSale: true,
        price: true,
        tempNumber: true,
      },
    });

    return res.json(todasPlantas);
  } catch (err) {
    return res.send(err).status(400);
  }
});

plantas.route("/plantas/:id").get(async (req: Request, res: Response) => {
  const idPlanta = req.params.id;

  if (!idPlanta) {
    return res.sendStatus(422);
  } else {
    try {
      const planta = await prisma.planta.findUnique({
        where: {
          id: Number(idPlanta),
        },
        select: {
          id: true,
          image: true,
          name: true,
          onSale: true,
          price: true,
          tempNumber: true,
        },
      });

      res.json({
        id: planta?.id,
        image: planta?.image,
        name: planta?.name,
        onSale: planta?.onSale,
        price: planta?.price,
        number: planta?.tempNumber,
      });
    } catch (err) {
      return res.send(err).status(400);
    }
  }
});

export default plantas;
