import { Request, Response, Router } from "express";
import { jwtDecode } from "jwt-decode";
import { prisma } from "../server";
import { v4 as uuidv4 } from "uuid";
import { DecodedToken } from "../interfaces/DecodedToken";

const auth = Router();

auth
  .route("/auth")
  .post(async (req: Request, res: Response) => {
    const credential = req.body.credential;

    if (!credential) {
      res.sendStatus(401);
    } else {
      try {
        const decodedToken: DecodedToken = jwtDecode(credential);

        const { email, name } = decodedToken;
        console.log(decodedToken);

        const alreadyUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        console.log(alreadyUser);

        const isAdmin = process.env.ADMIN_EMAIL?.includes(email);
        console.log(isAdmin);

        if (alreadyUser) {
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });
          if ((isAdmin && !user?.isAdmin) || (!isAdmin && user?.isAdmin)) {
            await prisma.user.update({
              where: {
                email: email,
              },
              data: {
                isAdmin: isAdmin,
              },
            });
          }

          res.send(user);
        } else if (!alreadyUser) {
          try {
            const user = await prisma.user.create({
              data: {
                id: uuidv4(),
                email: email,
                name: name,
                isAdmin: isAdmin,
              },
            });

            res.send(user);
          } catch (err) {
            res.sendStatus(401);
          }
        }
      } catch (err) {
        res.sendStatus(401);
      }
    }
  })
  .delete(async (req: Request, res: Response) => {
    const id = req.body.id;

    await prisma.user
      .delete({
        where: {
          id: id,
        },
      })
      .then(() => {
        res.send(200);
      });
  });

export default auth;
