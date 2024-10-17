import { Publisher, Subjects, OrderCreatedEvent } from "@amidsttickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: OrderCreatedEvent["subject"] = Subjects["OrderCreated"];
}
