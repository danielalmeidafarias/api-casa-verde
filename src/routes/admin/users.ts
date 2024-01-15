import { Router, Request, Response } from "express";
import { prisma } from "../../server";

const users = Router()

users.route("/users")
.get(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.send(users);
})

export default users