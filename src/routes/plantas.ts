import { Planta } from "./../interfaces/Planta";
import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const plantas = Router();

const prisma = new PrismaClient();

plantas.use(express.json());

plantas
  .route("/plantas")
  .get(async (req: Request, res: Response) => {
    const todasPlantas = await prisma.planta.findMany();

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
    } 
    else {

      await prisma.planta
      .create({
        data: {
          name: planta.name,
          image: planta.image,
          price: planta.price,
          onSale: planta.onSale,
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
