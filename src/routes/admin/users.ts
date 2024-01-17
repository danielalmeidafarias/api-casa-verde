import { Router, Request, Response } from "express";
import { prisma } from "../../server";

const users = Router();

users.route("/users").get(async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.send(users);
  } catch (err) {
    return res.send(err).status(400);
  }
});

export default users;
