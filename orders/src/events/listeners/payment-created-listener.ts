import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@amidsttickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import OrderModel from "../../models/orders.model";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await OrderModel.findByIdAndUpdate(data.orderId, {
      $set: { status: OrderStatus.Completed },
    });
      
      
      msg.ack()
  }
}
