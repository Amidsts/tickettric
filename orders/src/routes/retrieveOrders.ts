import { NextFunction, Request, Response, Router } from "express";
import { asyncWrapper, currentUser, requireAuth } from "@amidsttickets/common";
import OrderModel from "../models/orders.model";

const router = Router();

router.get(
  "/api/orders",
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      const order = await OrderModel.find({
        userId: req.currentUser?.id,
      }).populate("ticket");

      return res.status(200).send(order);
    }, next);
  }
);

export { router as showOrdersRouter };
