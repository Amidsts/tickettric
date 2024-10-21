import express, { NextFunction, Request, Response } from "express";
import {
  asyncWrapper,
  BadRequestError,
  currentUser,
  errorHandler,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateInput,
} from "@amidsttickets/common";
import { newPaymentSchema } from "../payment-schema";
import OrderModel from "../models/order-model";
import { stripe } from "../stripe";
import PaymentModel from "../models/payments-model";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  validateInput(newPaymentSchema),
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, orderId } = req.body;

    return asyncWrapper(async () => {
      const order = await OrderModel.findById(orderId);
      if (!order)
        return errorHandler({ err: new NotFoundError("order does not exist") });
      if (order.userId !== req.currentUser!.id)
        return errorHandler({
          err: new NotAuthorizedError(
            "you are not authourised to pay for this order"
          ),
        });
      if (order.status === OrderStatus.Canceled)
        return errorHandler({
          err: new BadRequestError("This order is cancelled"),
        });

      const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100,
        source: token,
      });

      const payment = await new PaymentModel({
        orderId,
        stripeId: charge.id,
      }).save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });
      res.status(201).send({});
    }, next);
  }
);

export { router as newPaymentRouter };
