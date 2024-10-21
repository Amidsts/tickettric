import { TicketUpdatedEvent } from "@amidsttickets/common";
import { Message } from "node-nats-streaming";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../../../payments/src/nats-wrapper";
import TicketModel from "../../../models/ticket.model";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  const ticket = await new TicketModel({
    _id: "95869d40-c987-448d-9879-d1bae12fa1312",
    title: "concert testing",
    price: 80,
  }).save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    userId: "95869d40-c987-448d-9879-d1bae12fa133",
    title: "test-concert",
    price: 40,
    orderId: "95869d40-c987-448d-9879-d1bae12fa1312",
  };
  return { ticket, msg, listener, data };
};

it("finds, update and create a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await TicketModel.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it("acks a message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
