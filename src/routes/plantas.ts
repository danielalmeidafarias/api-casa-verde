import { Planta } from "./../interfaces/Planta";
import { Router, Request, Response } from "express";
import { prisma } from "../server";

const plantas = Router();

plantas
  .route("/plantas")
  .get(async (req: Request, res: Response) => {
    const todasPlantas = await prisma.planta.findMany({
      where: {
        NOT: {
          number: 0
        }
      }
    });

    res.json(todasPlantas);
  })
  .post(async (req: Request, res: Response) => {
    const planta: Planta = req.body;

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
  });

plantas
  .route("/plantas/:id")
  .get(async (req: Request, res: Response) => {
    const idPlanta = req.params.id;

    const planta = await prisma.planta.findUnique({
      where: {
        id: Number(idPlanta),
      },
    });

    res.json(planta);
  })
  .delete(async (req: Request, res: Response) => {
    const idPlanta = req.params.id;

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
    const idPlanta = req.params.id;
    const plantaAtualizada: Planta = req.body;

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
          number: plantaAtualizada.number,
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
