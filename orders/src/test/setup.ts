import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { randomBytes } from "node:crypto";

jest.mock("../nats-wrapper");

let mongo: any;

beforeAll(async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("TESTING............");
  }

  //connect to db
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db?.collections();

  for (let collection of collections as mongoose.mongo.Collection<mongoose.mongo.BSON.Document>[]) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

(global as any).signin = (userId = new mongoose.Types.ObjectId()) => {
  const payload = {
    email: "test@test.com",
    id: userId,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
