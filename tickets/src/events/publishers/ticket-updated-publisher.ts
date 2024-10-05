import { Publisher, Subjects, TicketUpdatedEvent } from "@amidsttickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: TicketUpdatedEvent["subject"] = Subjects["TicketUpdated"];
}
