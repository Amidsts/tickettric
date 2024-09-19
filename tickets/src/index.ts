import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import app from "./app";
const prisma = new PrismaClient();

dotenv.config({ path: ".env.test" });
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw Error("JWT_KEY must be defined");
  }

  prisma
    .$connect()
    .then(() => {
      console.log("connected to mysql database");
      console.log(process.env.DATABASE_URL);
      app.listen(2000, () => {
        console.log("server is listening on 2000!");
      });
    })
    .catch((error) => {
      console.log("Error connecting to db: ", error);
    });
};

start();
