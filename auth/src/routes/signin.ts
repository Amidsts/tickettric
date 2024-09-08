import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateResult, BadRequestError } from "@amidsttickets/common";
import UserModel from "../models/user";
import { Password } from "../services/password";

const router = Router();

router.post(
  "/api/users/signin",
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
      if (!existingUser) {
        throw new BadRequestError("Bad credentials");
      }

      const passwordsMatch = await Password.compare(
        existingUser.password,
        password
      );
      if (!passwordsMatch) {
        throw new BadRequestError("Bad credentials");
      }

      if (!process.env.JWT_KEY) {
        throw Error("JWT_KEY must be defined");
      }


      const userjwt = jwt.sign(
        { id: existingUser._id, email: existingUser.email },
        process.env.JWT_KEY
      );

      req.session = {
        jwt: userjwt,
      };

      res.status(200).send(existingUser);

    } catch (error: any) {
      next(error)
    }
  }
);

export { router as signinRouter };
