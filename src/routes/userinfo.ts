import { Request, Response, Router } from "express";
import { prisma } from "../server";

const userInfo = Router();

userInfo.route("/userinfo/:userid").get(async (req: Request, res: Response) => {
  const userId = req.params.userid;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  res.send(user);
});

export default userInfo;
