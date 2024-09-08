"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("@amidsttickets/common");
const user_1 = __importDefault(require("../models/user"));
const password_1 = require("../services/password");
const router = (0, express_1.Router)();
exports.signinRouter = router;
router.post("/api/users/signin", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email must be valid"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 4, max: 10 })
        .withMessage("password must be between 4 & 10 char"),
], common_1.validateResult, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield user_1.default.findOne({ email });
        if (!existingUser) {
            throw new common_1.BadRequestError("Bad credentials");
        }
        const passwordsMatch = yield password_1.Password.compare(existingUser.password, password);
        if (!passwordsMatch) {
            throw new common_1.BadRequestError("Bad credentials");
        }
        if (!process.env.JWT_KEY) {
            throw Error("JWT_KEY must be defined");
        }
        const userjwt = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_KEY);
        req.session = {
            jwt: userjwt,
        };
        res.status(200).send(existingUser);
    }
    catch (error) {
        next(error);
    }
}));
