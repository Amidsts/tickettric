import { NextFunction, Request, Response, Router } from "express";
import { currentUser } from "@amidsttickets/common";

const router = Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send({ currentUser: req.currentUser || null });
    } catch (error) {
      next(error);
    }
  }
);

export { router as currentUserRouter };
