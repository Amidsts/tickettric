import {
  BadRequestError,
  errorHandler,
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from "@amidsttickets/common";
import TicketModel from "../../models/ticket.model";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await TicketModel.findById(data["id"]);

    if (!ticket) {
      return errorHandler({ err: new BadRequestError("Ticket not found") });
    }

    const { title, price, orderId } = data;
    ticket.set({ title, price, orderId });
    await ticket.save();
    msg.ack();
  }
}
