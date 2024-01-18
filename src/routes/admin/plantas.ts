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
      console.error(err);
      return res.status(400).send(err);
    }
  })
  .post(async (req: Request, res: Response) => {
    const planta: Planta = req.body.planta;

    if (!planta) {
      return res.status(422).send({ message: "Planta está faltando" });
    } else if (!planta.image || !planta.name || !planta.price) {
      return res
        .status(422)
        .send({ message: "Dados necessarios estao faltando" });
    } else if (
      await prisma.planta.findUnique({
        where: {
          name: planta.name,
        },
      })
    ) {
      return res
        .status(409)
        .send({ message: "Uma planta com esse nome já está registrada" });
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
              tempNumber: planta.number
            },
          })
          .then(() => {
            return res
              .status(200)
              .send({ message: "Planta criada com sucesso" });
          });
      } catch (err) {
        console.error(err);
        return res.status(400).send(err);
      }
    }
  })
  .delete(async (req: Request, res: Response) => {
    const idPlanta = req.query.id;

    if (!idPlanta) {
      return res.status(422).send({ message: "Id da planta faltando" });
    } else if (
      !(await prisma.planta.findUnique({
        where: {
          id: Number(idPlanta),
        },
      }))
    ) {
      return res
        .status(409)
        .send({ message: "Nenhuma planta com o id solicitado encontrada" });
    } else {
      try {
        await prisma.planta
          .delete({
            where: {
              id: Number(idPlanta),
            },
          })
          .then(() => {
            return res
              .status(200)
              .send({ message: "Planta excluida com sucesso!" });
          });
      } catch (err) {
        console.log(err);
        return res.status(400).send(err);
      }
    }
  })
  .put(async (req: Request, res: Response) => {
    const idPlanta = req.query.id;
    const plantaAtualizada: Planta = req.body.plantaAtualizada;

    if (!idPlanta) {
      return res.status(422).send({ message: "Id da planta faltando" });
    } else if (!plantaAtualizada) {
      return res.status(422).send({ message: "Dados novos faltando" });
    } else if (
      !(await prisma.planta.findUnique({
        where: {
          id: Number(idPlanta),
        },
      }))
    ) {
      return res
        .status(409)
        .send({ message: "Nenhuma planta com o id solicitado encontrada" });
    } else {
      try {
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
            return res
              .status(200)
              .send({ message: "Planta atualizada com sucesso" });
          });
      } catch (err) {
        console.log(err);
        return res.status(400).send(err);
      }
    }
  });

export default plantas;
