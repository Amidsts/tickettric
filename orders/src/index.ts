import "dotenv/config";
import mongoose from "mongoose";

import app from "./app";
import { natsWrapper } from "./nats-wrapper";

const { JWT_KEY, NATS_URL, NATS_CLUSTER_ID, NATS_CLIENT_ID, DATABASE_URL } =
  process.env;

const start = async () => {
  if (!JWT_KEY) {
    throw Error("JWT_KEY must be defined");
  }
  if (!NATS_URL) {
    throw Error("NATS_URL must be defined");
  }
  if (!NATS_CLUSTER_ID) {
    throw Error("NATS_CLUSTER_ID must be defined");
  }
  if (!NATS_CLIENT_ID) {
    throw Error("NATS_CLIENT_ID must be defined");
  }
  if (!DATABASE_URL) {
    throw Error("DATABASE_URL must be defined");
  }

  mongoose
    .connect(DATABASE_URL!)
    .then(async () => {
      console.log("connected to mongodb database");

      await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
    })
    .then(() => {
      app.listen(2000, () => {
        console.log("server is listening on 2000!");
      });
    })
    .catch((error) => {
      console.log("Error during project startup", error);
    });

  const gracefulShutdown = () => {
    console.log("Received server kill signal, shutting down gracefully.");

    async () => {
      try {
        natsWrapper.client.on("close", () => {
          console.log("NATS connection closed");
        });
        natsWrapper.client.close();
      } catch (err) {
        console.log("Error closing connections", err);
      } finally {
        process.exit();
      }
    };
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
  process.on("unhandledRejection", (error) => {
    console.log("unhandledRejectio Error: ", error);
    gracefulShutdown();
  });
  process.on("uncaughtException", (error) => {
    console.log("uncaughtException: ", error);
    gracefulShutdown();
  });
};

start();
