"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signoutRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.signoutRouter = router;
router.post("/api/users/signout", (req, res) => {
    req.session = null;
    res.send({});
});
