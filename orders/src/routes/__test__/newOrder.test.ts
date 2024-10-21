import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import { natsWrapper } from "../../../../payments/src/nats-wrapper";
import TicketModel from "../../models/ticket.model";
import OrderModel from "../../models/orders.model";

it("returns an error if ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toString();

  await request(app)
    .post("/api/orders")
    .set("Cookie", (global as any).signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if ticket is already reserved", async () => {
  const ticket = await new TicketModel({
    _id: "3784ff0d-4da9-462e-b115-4e0a1546a17e",
    title: "comedy live",
    price: 290,
  }).save();
  await new OrderModel({
    ticket,
    userId: "94sjbfhk",
    expiresAt: new Date(),
  }).save();

  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", (global as any).signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket (i.e create an order)", async () => {
  const ticket = await new TicketModel({
    _id: "3784ff0d-4da9-462e-b115-4e0a1546a19e",
    title: "comedy live",
    price: 290,
  }).save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", (global as any).signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = await new TicketModel({
    _id: "3784ff0d-4da9-462e-b115-4e0a1546a17e",
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
