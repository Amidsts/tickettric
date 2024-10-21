import {
  errorHandler,
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@amidsttickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import OrderModel from "../../models/order-model";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await OrderModel.findByIdAndUpdate(data.id, {
      $set: { status: OrderStatus.Canceled },
    });

    if (!order)
      return errorHandler({ err: new NotFoundError("order not found") });
    msg.ack();
  }
}
