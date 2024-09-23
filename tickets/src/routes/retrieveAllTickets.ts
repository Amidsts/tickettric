import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  asyncWrapper,
  errorHandler,
  NotFoundError,
  validateInput,
} from "@amidsttickets/common";
import { showTicketSchema } from "../inputSchema";

const prisma = new PrismaClient();
const router = Router();

router.get(
  "/api/tickets",
  (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      const tickets = await prisma.ticket.findMany();

      return res.status(200).send(tickets);
    }, next);
  }
);

export { router as retrieveAllTicketRouter };
