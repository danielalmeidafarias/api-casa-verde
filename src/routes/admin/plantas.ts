import { Request, Response, Router } from "express";
import { prisma } from "../../server";
import { Planta } from "../../interfaces/Planta";

const plantas = Router();

plantas
  .route("/plantas")
  .get(async (req: Request, res: Response) => {
    const todasPlantas = await prisma.planta.findMany();
    res.json(todasPlantas);
  })
  .post(async (req: Request, res: Response) => {
    const planta: Planta = req.body.planta;

    if (
      await prisma.planta.findUnique({
        where: {
          name: planta.name,
        },
      })
    ) {
      res.sendStatus(409);
    } else {
      await prisma.planta
        .create({
          data: {
            name: planta.name,
            image: planta.image,
            price: planta.price,
            onSale: planta.onSale,
            number: planta.number,
          },
        })
        .then(() => {
          res.sendStatus(200);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  })
  .delete(async (req: Request, res: Response) => {
    const idPlanta = req.query.id;

    await prisma.planta
      .delete({
        where: {
          id: Number(idPlanta),
        },
      })
      .then(() => {
        res.sendStatus(202);
      })
      .catch((e) => {
        res.send(e);
      });
  })
  .put(async (req: Request, res: Response) => {
    const idPlanta = req.query.id;
    const plantaAtualizada: Planta = req.body.plantaAtualizada;

    await prisma.planta
      .update({
        where: {
          id: Number(idPlanta),
        },
        data: {
          name: plantaAtualizada.name,
          image: plantaAtualizada.image,
          onSale: plantaAtualizada.onSale,
          price: plantaAtualizada.price,
          number: {
            increment: plantaAtualizada.number,
          },
          tempNumber: {
            increment: plantaAtualizada.number,
          },
        },
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((e) => {
        res.send(e);
      });
  });

export default plantas;
