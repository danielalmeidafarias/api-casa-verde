import { Router, Request, Response } from "express";
import { prisma } from "../../server";

const users = Router();

users.route("/users").get(async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.send(users);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
});

export default users;
