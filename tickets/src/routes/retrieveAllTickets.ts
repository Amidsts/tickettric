import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../utils/helpers";
import {
  asyncWrapper,
} from "@amidsttickets/common";

const router = Router();

router.get(
  "/api/tickets",
  (_req: Request, res: Response, next: NextFunction) => {
    return asyncWrapper(async () => {
      const tickets = await prisma.ticket.findMany();

      return res.status(200).send(tickets);
    }, next);
  }
);

export { router as retrieveAllTicketRouter };
