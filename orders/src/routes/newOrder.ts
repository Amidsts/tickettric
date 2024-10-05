import { NextFunction, Request, Response, Router } from "express";
import {
  asyncWrapper,
  currentUser,
  requireAuth,
  validateInput,
} from "@amidsttickets/common";
import { newOrderSchema } from "../inputSchema";

const router = Router();

router.post(
  "/api/orders",
  validateInput(newOrderSchema),
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      return res.status(200).send({});
    }, next);
  }
);

export { router as createOrderRouter };
