import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "@amidsttickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: OrderCancelledEvent["subject"] = Subjects["OrderCancelled"];
}
