import { ExpirationCompleteEvent, OrderStatus } from "@amidsttickets/common";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import TicketModel from "../../../models/ticket.model";
import OrderModel from "../../../models/orders.model";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = await new TicketModel({
    _id: "95869d40-c987-448d-9879-d1bae12fa1312",
    title: "concert testing",
    price: 80,
  }).save();

  const order = await new OrderModel({
    status: OrderStatus.Created,
    ticket,
    userId: "jskure",
    expiresAt: new Date(),
  }).save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order, ticket };
};

it("update the order status to cancelled", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await OrderModel.findById(order.id);
  expect(updatedOrder!.status).toBe(OrderStatus.Canceled);
});

it("emits order cancelled event", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
