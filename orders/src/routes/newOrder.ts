import express, { NextFunction, Request, Response } from "express";
import {
  asyncWrapper,
  BadRequestError,
  currentUser,
  errorHandler,
  NotFoundError,
  requireAuth,
  validateInput,
} from "@amidsttickets/common";
import { newOrderSchema } from "../inputSchema";
import TicketModel, { TicketDoc } from "../models/ticket.model";
import OrderModel from "../models/orders.model";
import { OrderCreatedPublisher } from "../events/publisers/ordercreated-publisher";
import { natsWrapper } from "../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 60 * 1;
const router = express.Router();

router.post(
  "/api/orders",
  validateInput(newOrderSchema),
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;

    return asyncWrapper(async () => {
      const ticket = await TicketModel.findById(ticketId);
      if (!ticket)
        return errorHandler({
          err: new NotFoundError("Ticket does not exist"),
        });

      const isReservedTicket = await ticket!.isReserved();
      if (isReservedTicket) {
        await errorHandler({
          err: new BadRequestError("This ticket is already reserved"),
        });
      }
      const expiration = new Date();
      expiration.setSeconds(
        expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
      );

      const order = await new OrderModel({
        userId: req.currentUser!.id,
        ticket: ticket as TicketDoc,
        expiresAt: expiration,
      }).save();

      await new OrderCreatedPublisher(natsWrapper.client).publish({
        userId: order.userId,
        id: order.id,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        ticket: { id: ticket.id, price: ticket.price },
      });

      return res.status(201).send(order);
    }, next);
  }
);

export { router as createOrderRouter };
