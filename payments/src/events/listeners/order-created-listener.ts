import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@amidsttickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import OrderModel from "../../models/order-model";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await new OrderModel({
      _id: data.id,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price,
    }).save();

    msg.ack();
  }
}
