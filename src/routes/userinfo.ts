import { Request, Response, Router } from "express";
import { prisma } from "../server";

const userInfo = Router();

userInfo.route("/userinfo/:userid").get(async (req: Request, res: Response) => {
  const userId = req.params.userid;
  if (!userId) {
    return res.sendStatus(422);
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return res.send(user);
    } catch (err) {
      return res.send(err).status(400);
    }
  }
});

export default userInfo;
