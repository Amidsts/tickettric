import jwt from "jsonwebtoken";
import { prisma } from "../utils/helpers";
import { randomBytes } from "node:crypto";

jest.mock("../nats-wrapper");

beforeAll(async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("TESTING............");
  }
  //connect to db
  await prisma.$connect();
});

beforeEach(async () => {
  jest.clearAllMocks()
  await prisma.ticket.deleteMany();
});

afterAll(async () => {
  await prisma.ticket.deleteMany();
  await prisma.$disconnect();
});

(global as any).signin = () => {
  const payload = {
    email: "test@test.com",
    id: randomBytes(3).toString("hex"),
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
