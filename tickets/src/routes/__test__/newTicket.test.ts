import request from "supertest";
import app from "../../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

it('has a route handler for "/api/tickets for post request', async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("returns an error for invalid title", async () => {
  await request(app).post("/api/tickets").send({ price: "90" }).expect(400);
});

it("returns an error for invalid price", async () => {
  await request(app)
    .post("/api/tickets")
    .send({ title: "footbal" })
    .expect(400);
});

it("throws an error for user that is not logged in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .send({ title: "footbal", price: 90 });

  expect(response.status).toBe(401);
});

it("create a ticket with valid input parameters", async () => {
  let tickets = await prisma.ticket.findMany();
  expect(tickets.length).toBe(0);

  const cookie = (global as any).signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie!)
    .send({ title: "footbal", price: 90 });

  tickets = await prisma.ticket.findMany();
  expect(response.status).toBe(200);
  expect(tickets.length).toBe(1);
});
