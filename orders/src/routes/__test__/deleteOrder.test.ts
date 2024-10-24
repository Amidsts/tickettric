import request from "supertest";

import app from "../../app";
import TicketModel from "../../models/ticket.model";
import { natsWrapper } from "../../nats-wrapper";

const createTicket = async () => {
  return await new TicketModel({
    _id: "123456789",
    title: "concert",
    price: 90,
  }).save();
};

it("marks an order as cancelled", async () => {
  const user1 = (global as any).signin();
  const ticket = await createTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user1)
    .expect(204);
});

it("emits an order cancelled event", async () => {
  const ticket = await new TicketModel({
    _id: "123456789",
    title: "comedy live",
    price: 290,
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", (global as any).signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
