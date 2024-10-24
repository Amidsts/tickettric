import { Publisher, Subjects, TicketCreatedEvent } from "@amidsttickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects["TicketCreated"];
}
