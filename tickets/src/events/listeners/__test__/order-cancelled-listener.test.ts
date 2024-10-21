import { OrderCancelledEvent, OrderStatus } from "@amidsttickets/common";
import { prisma } from "../../../utils/helpers";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const ticket = await prisma.ticket.create({
    data: {
      title: "test concert",
      price: 20,
      userId: "95869d40-c987-448d-9879-d1bae12fa1312",
      orderId: "95869d40-c987-448d-9879-d1bae12fa1312",
    },
  });

  const data: OrderCancelledEvent["data"] = {
    id: "95869d70-c987-428d-9879-d1bae12fa1312",
    ticket: { id: ticket.id },
  };

  const listener = new OrderCancelledListener(natsWrapper.client);

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, listener, data, ticket };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { msg, listener, data, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await prisma.ticket.findFirst({
    where: { id: data.ticket.id },
  });

  expect(updatedTicket?.id).toEqual(data.ticket.id);
  expect(updatedTicket?.orderId).toBeNull();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
