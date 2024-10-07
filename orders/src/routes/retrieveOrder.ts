import { NextFunction, Request, Response, Router } from "express";
import {
  asyncWrapper,
  currentUser,
  errorHandler,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@amidsttickets/common";
import OrderModel from "../models/orders.model";

const router = Router();

router.get(
  "/api/orders/:orderId",
  currentUser,
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      const order = await OrderModel.findById(req.params.orderId).populate(
        "ticket"
      );
      if (!order)
        return errorHandler({ err: new NotFoundError("ticket not found") });

      if (req.currentUser?.id !== order.userId)
        return errorHandler({
          err: new NotAuthorizedError(
            "you cannot retrieved an order that does not belong to you"
          ),
        });

      return res.status(200).send(order);
    }, next);
  }
);

export { router as showOrderRouter };
