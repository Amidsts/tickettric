import request from "supertest";
import app from "../../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

it("can fetch the list of all tickets", async () => {
    const tickets = await prisma.ticket.createMany({
      data: [
        {
          title: "footbal",
          price: 90,
          userId: "f2c25072-c5a2-43cc-8c2c-38782265cd73",
        },
        {
          title: "basketBall",
          price: 879,
          userId: "f2c25072-c5a2-43cc-8c2c-38782265cd73",
        },
        {
          title: "Tennis",
          price: 127,
          userId: "f2c25072-c5a2-43cc-8c2c-38782265cd73",
        },
      ],
    });

  const response = await request(app).get("/api/tickets").send().expect(200);
});
