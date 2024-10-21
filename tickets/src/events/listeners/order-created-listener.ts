import {
  errorHandler,
  Listener,
  NotAuthorizedError,
  OrderCreatedEvent,
  Subjects,
} from "@amidsttickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { prisma } from "../../utils/helpers";
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await prisma.ticket.findFirst({
      where: { id: data.ticket.id },
    });
    if (!ticket)
      return errorHandler({ err: new NotAuthorizedError("ticket not found") });

    const updatedTicket = await prisma.ticket.update({
      where: { id: data.ticket.id },
      data: { orderId: data.id },
    });

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: updatedTicket.orderId as string,
    });

    msg.ack();
  }
}
