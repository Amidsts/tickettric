import { Listener, Subjects, TicketCreatedEvent } from "@amidsttickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import TicketModel from "../../models/ticket.model";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    await new TicketModel({ _id: id, title, price }).save();

    msg.ack();
  }
}
