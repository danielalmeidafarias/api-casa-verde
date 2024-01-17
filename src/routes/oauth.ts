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
      return res.sendStatus(401);
    } else {
      try {
        const decodedToken: DecodedToken = jwtDecode(credential);

        const { email, name } = decodedToken;

        const alreadyUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        const isAdmin = process.env.ADMIN_EMAIL?.includes(email);

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

          return res.send(user);
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

            return res.send(user);
          } catch (err) {
            return res.sendStatus(401);
          }
        }
      } catch (err) {
        return res.sendStatus(401);
      }
    }
  })
  .delete(async (req: Request, res: Response) => {
    const id = req.body.id;

    if (!id) {
      res.json({ message: "Id de usuário faltando" }).status(422);
    } else {
      await prisma.user
        .delete({
          where: {
            id: id,
          },
        })
        .then(() => {
          return res.send(200);
        })
        .catch((err) => {
          console.log(err);
          console.log(id);
         return res.sendStatus(401);
        });
    }
  });

export default auth;
