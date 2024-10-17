import {
  BadRequestError,
  errorHandler,
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from "@amidsttickets/common";
import TicketModel from "../../models/ticket.model";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queu-group-name";

export class TicketUpdatedLister extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await TicketModel.findById(data["id"]);

    if (!ticket) {
      return errorHandler({ err: new BadRequestError("Ticket not found") });
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
