import request from "supertest";
import app from "../../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

it("returns 401 if the user does not own the ticket", async () => {});

it("returns 400 if the user provide invalid title or price", async () => {});

it("create update a ticket with provide valid input", async () => {});
