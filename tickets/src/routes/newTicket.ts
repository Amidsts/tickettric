import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../utils/helpers";
import {
  asyncWrapper,
  currentUser,
  requireAuth,
  validateInput,
} from "@amidsttickets/common";
import { newTicketSchema } from "../inputSchema";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publishers";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/tickets",
  validateInput(newTicketSchema),
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      const { title, price } = req.body;
      const ticket = await prisma.ticket.create({
        data: { title, price, userId: req.currentUser!.id },
      });

      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        userId: ticket.userId,
        title: ticket.title,
        price: ticket.price,
      });
      return res.status(200).send(ticket);
    }, next);
  }
);

export { router as createTicketRouter };
