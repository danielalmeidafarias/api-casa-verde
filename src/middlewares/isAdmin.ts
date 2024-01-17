import { NextFunction, Request, Response } from "express";
import { prisma } from "../server";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  let adminId;

  if (req.method === "GET" || req.method === "DELETE" || req.method === "PUT") {
    adminId = req.query.adminId;
  } else {
    adminId = req.body.adminId;
  }

  if (adminId) {
    const adminUser = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!adminUser || !process.env.ADMIN_EMAIL?.includes(adminUser?.email)) {
      return res.sendStatus(401);
    } else {
      next();
    }
  } else {
    return res.status(417).send({ Error: "Id faltando" });
  }
};

export default isAdmin;
