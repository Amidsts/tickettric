import {PrismaClient} from "@prisma/client"

import app from "./app"
const prisma = new PrismaClient()

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw Error('JWT_KEY must be defined')
  }
             
  try {
    await prisma.$connect()

    console.log("connected to mysql database");
  } catch (error) {
    console.log("Error connecting to db: " ,error);
  }

  app.listen(2000, () => {
    console.log("server is listening on 2000!");
  });
};

start();
