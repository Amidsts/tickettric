import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const { NATS_URL, NATS_CLUSTER_ID, NATS_CLIENT_ID } = process.env;

const start = async () => {
  if (!NATS_URL) {
    throw Error("NATS_URL must be defined");
  }
  if (!NATS_CLUSTER_ID) {
    throw Error("NATS_CLUSTER_ID must be defined");
  }
  if (!NATS_CLIENT_ID) {
    throw Error("NATS_CLIENT_ID must be defined");
  }

  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (error) {
    console.log("Error during project startup", error);
  }

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
