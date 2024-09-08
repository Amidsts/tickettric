import mongoose from "mongoose";
import app from "./app";

const start = async () => {
  // if (!process.env.JWT_KEY) {
  //   throw Error("JWT_KEY must be defined");
  // }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/mongo-db");
    console.log("connected to db");
    app.listen(2000, () => {
      console.log("server is listening on port 2000!");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
