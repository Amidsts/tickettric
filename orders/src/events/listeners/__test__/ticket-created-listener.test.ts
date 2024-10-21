import { TicketCreatedEvent } from "@amidsttickets/common";
import { natsWrapper } from "../../../../../payments/src/nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import TicketModel from "../../../models/ticket.model";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    id: "95869d40-c987-448d-9879-d1bae12fa1312",
    userId: "95869d40-c987-448d-9879-d1bae12fa133",
    title: "test-concert",
    price: 40,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and save a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const ticket = await TicketModel.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks a message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
