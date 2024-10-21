import { OrderCancelledEvent, OrderStatus } from "@amidsttickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import OrderModel from "../../../models/order-model";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = await new OrderModel({
    _id: new mongoose.Types.ObjectId().toHexString(),
    userId: "jnrwer",
    status: OrderStatus.Canceled,
    price: 20,
  }).save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    ticket: {
      id: "osfjiej",
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("update the status of the order to cancelled", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await OrderModel.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
