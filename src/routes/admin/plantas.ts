import { Request, Response, Router } from "express";
import { prisma } from "../../server";
import { Planta } from "../../interfaces/Planta";

const plantas = Router();

plantas
  .route("/plantas")
  .get(async (req: Request, res: Response) => {
    try {
      const todasPlantas = await prisma.planta.findMany();
      return res.json(todasPlantas);
    } catch (err) {
      return res.send(err).status(400);
    }
  })
  .post(async (req: Request, res: Response) => {
    const planta: Planta = req.body.planta;

    if (!planta) {
      return res.sendStatus(422);
    } else if (
      await prisma.planta.findUnique({
        where: {
          name: planta.name,
        },
      })
    ) {
      return res.sendStatus(409);
    } else {
      try {
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
            return res.sendStatus(200);
          });
      } catch (err) {
        return res.send(err).status(400);
      }
    }
  })
  .delete(async (req: Request, res: Response) => {
    const idPlanta = req.query.id;

    if (!idPlanta) {
      return res.sendStatus(422);
    } else {
      await prisma.planta
        .delete({
          where: {
            id: Number(idPlanta),
          },
        })
        .then(() => {
          return res.sendStatus(200);
        })
        .catch((e) => {
          return res.send(e).status(400);
        });
    }
  })
  .put(async (req: Request, res: Response) => {
    const idPlanta = req.query.id;
    const plantaAtualizada: Planta = req.body.plantaAtualizada;

    if (!idPlanta || !plantaAtualizada) {
      return res.sendStatus(422);
    } else {
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
          return res.sendStatus(200);
        })
        .catch((e) => {
          return res.send(e);
        });
    }
  });

export default plantas;
