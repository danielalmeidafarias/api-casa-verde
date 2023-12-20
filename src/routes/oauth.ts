import { Request, Response, Router } from "express";
import {  jwtDecode } from "jwt-decode";
import { prisma } from "../server";
import { v4 as uuidv4 } from "uuid";
import { DecodedToken } from "../interfaces/DecodedToken";

const auth = Router();

auth
  .route("/auth")
  .post(async (req: Request, res: Response) => {
    const credential = req.body.credential;
    const decodedToken: DecodedToken = jwtDecode(credential);

    const { email, name } = decodedToken;

    const alreadyUser = await prisma.user.findUnique({
      where: {
        email: email,
      }
    });

    if (alreadyUser) {
      const userId = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
        },
      });
      res.send(userId);
    } else if (!alreadyUser) {
      try {
        const user = await prisma.user.create({
          data: {
            id: uuidv4(),
            email: email,
            name: name,
          },
        })

        res.send(user.id)
      } catch(err) {
        console.log(err)
        res.sendStatus(401)
      }

    }
  })
  .get(async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();

    res.send(users);
  })
  .delete(async (req: Request, res: Response) => {
    const id = req.body.id;

    await prisma.user.delete({
      where: {
        id: id,
      },
    }).then(() => {
      res.send(200)
    })
  });

export default auth;
