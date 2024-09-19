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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicketRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const common_1 = require("@amidsttickets/common");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.createTicketRouter = router;
router.post("/api/tickets", [
    (0, express_validator_1.body)("title").trim().notEmpty().withMessage("please provide a name"),
    (0, express_validator_1.body)("price").trim().notEmpty().withMessage("please provide a price"),
], common_1.validateResult, 
// currentUser,
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, price } = req.body;
        const ticket = yield prisma.ticket.create({ data: { title, price } });
        res.status(200).send({ ticket });
    }
    catch (error) {
        next(error);
    }
}));
