import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@amidsttickets/common";
import { createTicketRouter } from "./routes/newTicket";

const app = express();


app.set("trust proxy", true);
app
  .use(cors())
  .use(express.json({ limit: "50kb" }))
  .use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== "test",
    })
  )
  .use(createTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);


export default app;
