import request from "supertest";
import app from "../../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

it("should return 404 if the ticket is not found", async () => {
  await request(app).get("/api/tickets/sjhdwkug").send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const ticket = await prisma.ticket.create({
    data: { title: "testTicket", price: 46, userId: "1237489576" },
  });

  const response = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toBe("testTicket");
  expect(response.body.price).toBe(46);
});
