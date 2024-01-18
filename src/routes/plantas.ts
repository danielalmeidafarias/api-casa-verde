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
    return res.status(400).send(err);
  }
});

plantas.route("/plantas/:id").get(async (req: Request, res: Response) => {
  const idPlanta = req.params.id;

  if (!idPlanta) {
    return res.status(422).send({ message: "Id da planta faltando" });
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

      if(!planta) {
        return res.status(409).send({message: "Nenhuma planta com o id fornecido foi encontrada"})
      }

      res.json({
        id: planta?.id,
        image: planta?.image,
        name: planta?.name,
        onSale: planta?.onSale,
        price: planta?.price,
        number: planta?.tempNumber,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  }
});

export default plantas;
