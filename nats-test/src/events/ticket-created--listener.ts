import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-event-interface";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event Data!", data);

    msg.ack();
  }
}
