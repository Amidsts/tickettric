import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  asyncWrapper,
  currentUser,
  errorHandler,
  NotFoundError,
  requireAuth,
  validateInput,
} from "@amidsttickets/common";
import { newTicketSchema } from "../inputSchema";

const prisma = new PrismaClient();
const router = Router();

router.put(
  "/api/tickets/:ticketId",
  validateInput(newTicketSchema),
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      const { ticketId } = req.params;
      const { title, price } = req.body;
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket)
        return errorHandler({
          err: new NotFoundError("ticket does not exist"),
        });
        
      return res.status(200).send({ ticket });
    }, next);
  }
);

export { router as updateTicketRouter };
