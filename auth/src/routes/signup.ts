import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import UserModel from "../models/user";
import { BadRequestError, validateResult } from "@amidsttickets/common";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 10 })
      .withMessage("password must be between 4 & 10 char"),
  ],
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
  
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("Email in use");
      }

      if (!process.env.JWT_KEY) {
        throw Error("JWT_KEY must be defined");
      }

      const user = await new UserModel({ email, password }).save();
      const userjwt = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_KEY
      );

      req.session = {
        jwt: userjwt,
      };

      res.status(201).send(user);
      
    } catch (error: any) {
      next(error)
    }
  }
);

export { router as signupRouter };
