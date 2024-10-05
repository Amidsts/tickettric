import { NextFunction, Request, Response, Router } from "express";
import {
  asyncWrapper,
  currentUser,
  requireAuth,
  validateInput,
} from "@amidsttickets/common";

const router = Router();

router.delete(
  "/api/orders/:orderId",
  // validateInput(newTicketSchema),
  // currentUser,
  // requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      return res.status(200).send({});
    }, next);
  }
);

export { router as deleteOrderRouter };
