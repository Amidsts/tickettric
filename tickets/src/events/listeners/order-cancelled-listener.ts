import {
  errorHandler,
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from "@amidsttickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { prisma } from "../../utils/helpers";
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await prisma.ticket.findFirst({
      where: { id: data.ticket.id },
    });
    if (!ticket)
      return errorHandler({
        err: new NotFoundError("ticket not found"),
      });

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { orderId: null },
    });

    await new TicketUpdatedPublisher(this.client).publish({
      id: updatedTicket.id,
      title: updatedTicket.title,
      price: updatedTicket.price,
      userId: updatedTicket.userId,
      orderId: updatedTicket.orderId as string,
    });

    msg.ack();
  }
}
