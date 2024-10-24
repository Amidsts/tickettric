import "dotenv/config";
import mongoose from "mongoose";

import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const { JWT_KEY, NATS_URL, NATS_CLUSTER_ID, NATS_CLIENT_ID, DATABASE_URL_ORDERS } =
  process.env;

const start = async () => {
  console.log("Starting Up....");

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
  if (!DATABASE_URL_ORDERS) {
    throw Error("DATABASE_URL must be defined");
  }

  mongoose
    .connect(DATABASE_URL_ORDERS!)
    .then(async () => {
      console.log("connected to mongodb database");

      await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);

      new TicketCreatedListener(natsWrapper.client).listen();
      new TicketUpdatedListener(natsWrapper.client).listen();
      new ExpirationCompleteListener(natsWrapper.client).listen();
      new PaymentCreatedListener(natsWrapper.client).listen();
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
