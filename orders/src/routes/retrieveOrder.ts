import { NextFunction, Request, Response, Router } from "express";
import {
  asyncWrapper,
  errorHandler,
  NotFoundError,
  validateInput,
} from "@amidsttickets/common";

const router = Router();

router.get(
  "/api/orders/:orderId",
  //   validateInput(showTicketSchema, "params"),
  (req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      return res.status(200).send({});
    }, next);
  }
);

export { router as showOrderRouter };
