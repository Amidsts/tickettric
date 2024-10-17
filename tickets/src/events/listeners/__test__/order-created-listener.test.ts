import { OrderStatus } from "@amidsttickets/common";
import { prisma } from "../../../utils/helpers";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const ticket = await prisma.ticket.create({
    data: {
      title: "test concert",
      price: 20,
      userId: "95869d40-c987-448d-9879-d1bae12fa1312",
    },
  });

  const data = {
    id: "95869d40-c987-448d-9879-d1bae12fa1312",
    userId: "95869d70-c987-428d-9879-d1bae12fa1312",
    status: OrderStatus.Created,
    ticket: { id: ticket.id, price: ticket.price },
    expiresAt: new Date().toString(),
  };

  const listener = new OrderCreatedListener(natsWrapper.client);

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, listener, data, ticket };
};

it("update(or lock) a ticket by adding orderId", async () => {
  const { msg, listener, data, ticket } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await prisma.ticket.findFirst({
    where: { id: ticket.id },
  });

  expect(updatedTicket?.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
