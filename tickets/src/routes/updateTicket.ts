import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../utils/helpers";
import {
  asyncWrapper,
  BadRequestError,
  currentUser,
  errorHandler,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateInput,
} from "@amidsttickets/common";
import { newTicketSchema } from "../inputSchema";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

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

      if (!ticket) {
        return errorHandler({
          err: new NotFoundError("ticket does not exist"),
        });
      }

      if (ticket.orderId)
        return errorHandler({
          err: new BadRequestError("You cannot edit a reserved ticket!"),
        });

      if (req.currentUser!.id !== ticket.userId) {
        return errorHandler({
          err: new NotAuthorizedError(
            "you are not authorised to edit this card"
          ),
        });
      }

      await prisma.ticket.update({
        where: {
          id: ticketId,
        },
        data: {
          title,
          price,
        },
      });

      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        title,
        price,
        userId: req.currentUser!.id,
        id: ticketId,
      });

      return res.status(200).send({ ticket });
    }, next);
  }
);

export { router as updateTicketRouter };
