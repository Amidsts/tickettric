import request from "supertest";
import app from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { prisma } from "../../utils/helpers";

it("returns 404 if the provided ticket id does not exist", async () => {
  const ticketId = "f2c25072-c5a2-43cc-8c2c-38782265cd73";
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", (global as any).signin())
    .send({ title: "footbal", price: 90 })
    .expect(404);
});

it("returns 401 if the user is not authenticated", async () => {
  const ticketId = "f2c25072-c5a2-43cc-8c2c-38782265cd73";
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({ title: "footbal", price: 90 })
    .expect(401);
});

it("returns 401 if the user does not own the ticket", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", (global as any).signin()!)
    .send({ title: "footbal", price: 90 })
    .expect(200);

  const response = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", (global as any).signin())
    .send({ title: "footbal", price: 90 });

  expect(response.status).toBe(401);
});

it("returns 400 if the user provide invalid title or price", async () => {
  const ticketId = "f2c25072-c5a2-43cc-8c2c-38782265cd73";

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({ title: "footbal" })
    .expect(400);

  const res = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({ price: 90 });

  expect(res.status).toBe(400);
});

it("update a ticket with provide valid input", async () => {
  const cookie = (global as any).signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie!)
    .send({ title: "footbal", price: 90 });

  const res = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "football", price: 900 })
    .expect(200);
});

it("publish an event", async () => {
  const cookie = (global as any).signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie!)
    .send({ title: "footbal", price: 90 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "football", price: 900 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("reject update if ticket is reserved", async () => {
  const cookie = (global as any).signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie!)
    .send({ title: "footbal", price: 90 });

  await prisma.ticket.update({
    where: { id: response.body.id },
    data: { orderId: "idjewiej" },
  });

  const res = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "football", price: 900 });

  expect(res.status).toBe(400);
});
