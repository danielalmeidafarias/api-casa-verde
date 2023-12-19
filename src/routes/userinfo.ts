import { Request, Response, Router } from "express";
import { prisma } from "../server";

const userInfo = Router();

userInfo.route("/userinfo/:userid").get(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
  });
  
  // const cart = await prisma.cart.findUnique({
  //   where: {
  //     userId: userId,
  //   },
  // });

  // res.send({ user, cart })
  res.send({message: 'Hello world'})
});

export default userInfo