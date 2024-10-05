import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
const stan = nats.connect("tickettric", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  await new TicketCreatedPublisher(stan).publish({
    id: "182",
    title: "concert",
    price: 90,
  });
  // const data = JSON.stringify({
  //   id: 18,
  //   title: "concert",
  //   price: 90,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event Published");
  // });
});
