import mongoose from "mongoose";
import app from "./app";
import "dotenv/config";
import appConfig from "./config/index";

const { jwtKey, databaseUrl, port } = appConfig;

const start = async () => {
  if (!jwtKey) {
    throw Error("JWT_KEY must be defined!");
  }

  mongoose
    .connect(databaseUrl)
    .then(() => {
      console.log("connected to mongodb database");

      app.listen(port as string, () => {
        console.log(`server is listening on port ${port}!`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

start();
