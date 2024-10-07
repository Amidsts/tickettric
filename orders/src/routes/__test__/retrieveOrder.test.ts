import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import TicketModel from "../../models/ticket.model";

const createTicket = async () => {
  return await new TicketModel({ title: "concert", price: 90 }).save();
};

it("trows an error for orders that does not exist", async () => {
  const orderId = new mongoose.Types.ObjectId();

  await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", (global as any).signin())
    .expect(404);
});

it("throw an error if user tries to access another user's order", async () => {
  const user1 = (global as any).signin();
  const user2 = (global as any).signin();
  const ticket = await createTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .expect(401);
});

it("fetches an order for a user", async () => {
  const user1 = (global as any).signin();
  const ticket = await createTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);

   await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user1).expect(200)
});
