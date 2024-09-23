import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

beforeAll(async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("TESTING............");
  }
  //connect to db
});

beforeEach(async () => {
  await prisma.ticket.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

(global as any).signin = () => {
  const payload = {
    email: "test@test.com",
    id: "parssyward",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
