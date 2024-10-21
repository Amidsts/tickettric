import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import { newPaymentRouter } from "./routes/new-payment";

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
  .use(newPaymentRouter)


app.all("*", (_req, res: Response) => {
  return res.send(400).send({
    message: "You have used an invalid method or hit an invalid route",
  });
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(400).json({
    message: err.message,
  });
});

export default app;
