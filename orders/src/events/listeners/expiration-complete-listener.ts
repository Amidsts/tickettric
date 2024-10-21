import {
  errorHandler,
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from "@amidsttickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import OrderModel from "../../models/orders.model";
import { OrderCancelledPublisher } from "../../events/publisers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const { orderId } = data;
    const order = await OrderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: OrderStatus.Canceled } }
    );

    if (!order)
      return errorHandler({ err: new NotFoundError("Order does not exist") });

    if (order.status === OrderStatus.Completed) return msg.ack();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: { id: order.ticket.id },
    });

    msg.ack();
  }
}
