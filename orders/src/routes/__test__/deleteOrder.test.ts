import request from "supertest";


import app from "../../app";
import TicketModel from "../../models/ticket.model";

const createTicket = async () => {
  return await new TicketModel({ title: "concert", price: 90 }).save();
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
})