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
  "/api/tickets/:ticketId",
  validateInput(showTicketSchema, "params"),
  (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      const { ticketId } = req.params;
      const ticket = await prisma.ticket.findFirst({ where: { id: ticketId } });

      if (!ticket) return errorHandler({ err: new NotFoundError("Ticket not found") });

      return res.status(200).send(ticket );
    }, next);
  }
);

export { router as showTicketRouter };
