import { Planta } from "./../interfaces/Planta";
import { Router, Request, Response } from "express";
import { prisma } from "../server";

const plantas = Router();

plantas.route("/plantas").get(async (req: Request, res: Response) => {
  const todasPlantas = await prisma.planta.findMany({
    where: {
      NOT: {
        number: 0,
      },
    },
    select: {
      tempNumber: false,
    },
  });

  res.json(todasPlantas);
});

plantas.route("/plantas/:id").get(async (req: Request, res: Response) => {
  const idPlanta = req.params.id;

  const planta = await prisma.planta.findUnique({
    where: {
      id: Number(idPlanta),
    },
    select: {
      tempNumber: false,
    },
  });

  res.json(planta);
});

export default plantas;
