import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler, NotFoundError } from "@amidsttickets/common";

const app = express();
app.set('trust proxy', true)
app
  .use(cors())
  .use(express.json({ limit: "50kb" }))
  .use(
    cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test'
    })
  )
  .use(signinRouter)
  .use(signupRouter)
  .use(currentUserRouter)
  .use(signoutRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
