import { Request, Response, Router } from "express";
import { prisma } from "../server";

const userInfo = Router();

userInfo.route("/userinfo/:userid").get(async (req: Request, res: Response) => {
  const userId = req.params.userid;
  if (!userId) {
    return res.status(422).send({ message: "Id de usuario faltando" });
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return res.send(user);
    } catch (err) {
      return res.status(400).send(err);
    }
  }
});

export default userInfo;
