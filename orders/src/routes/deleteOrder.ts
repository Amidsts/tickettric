import { NextFunction, Request, Response, Router } from "express";
import {
  asyncWrapper,
  currentUser,
  errorHandler,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateInput,
} from "@amidsttickets/common";
import OrderModel from "../models/orders.model";

const router = Router();

router.delete(
  "/api/orders/:orderId",
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      const order = await OrderModel.findById(req.params.orderId).populate(
        "ticket"
      );
      if (!order)
        return errorHandler({
          err: new NotFoundError("ticket not found"),
        });

      if (req.currentUser?.id !== order.userId)
        return errorHandler({
          err: new NotAuthorizedError(
            "you cannot retrieved an order that does not belong to you"
          ),
        });
      order.status = OrderStatus.Canceled;
      await order.save();

      return res.status(204).send(order);
    }, next);
  }
);

export { router as deleteOrderRouter };
