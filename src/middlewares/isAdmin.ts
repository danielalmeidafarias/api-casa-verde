import { NextFunction, Request, Response } from "express";
import { prisma } from "../server";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const adminId = req.body.adminId;

  if (adminId) {
    const adminUser = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!adminUser || !process.env.ADMIN_EMAIL?.includes(adminUser?.email)) {
      res.sendStatus(401);
    } else {
      next();
    }
  } else {
    res.status(417).send({ Error: "Id faltando" });
  }
};

export default isAdmin;
