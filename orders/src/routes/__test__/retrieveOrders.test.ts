import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import app from "../../app";
import TicketModel from "../../models/ticket.model";



const createTicket = async () => {
  return await new TicketModel({
    _id: uuidv4(),
    title: "concert",
    price: 90,
  }).save();
};

it("fetches all orders for a particular user", async () => {
  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();

  const user1 = (global as any).signin();
  const user2 = (global as any).signin();

  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket2.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id });

  const res = await request(app).get("/api/orders").set("Cookie", user1);

  expect(res.body.length).toEqual(2);
  expect(res.body[0].userId).toEqual(order1.userId);
  expect(res.body[1].userId).toEqual(order2.userId);
});
