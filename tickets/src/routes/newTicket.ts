import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { body } from "express-validator";
import { currentUser, validateResult } from "@amidsttickets/common";

const prisma = new PrismaClient();

const router = Router();

router.post(
  "/api/tickets",
  [
    body("title").trim().notEmpty().withMessage("please provide a name"),
    body("price").trim().notEmpty().withMessage("please provide a price"),
  ],
  validateResult,
  // currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, price } = req.body;
      const ticket = await prisma.ticket.create({ data: { title, price } });

      res.status(200).send({ ticket });
    } catch (error) {
      next(error);
    }
  }
);

export { router as createTicketRouter };
