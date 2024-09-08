"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserRouter = void 0;
const express_1 = require("express");
const common_1 = require("@amidsttickets/common");
const router = (0, express_1.Router)();
exports.currentUserRouter = router;
router.get("/api/users/currentuser", common_1.currentUser, (req, res, next) => {
    try {
        res.send({ currentUser: req.currentUser || null });
    }
    catch (error) {
        next(error);
    }
});
