"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const current_user_1 = require("./routes/current-user");
const signin_1 = require("./routes/signin");
const signup_1 = require("./routes/signup");
const signout_1 = require("./routes/signout");
const common_1 = require("@amidsttickets/common");
const app = (0, express_1.default)();
app.set('trust proxy', true);
app
    .use((0, cors_1.default)())
    .use(express_1.default.json({ limit: "50kb" }))
    .use((0, cookie_session_1.default)({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
    .use(signin_1.signinRouter)
    .use(signup_1.signupRouter)
    .use(current_user_1.currentUserRouter)
    .use(signout_1.signoutRouter);
app.all("*", () => {
    throw new common_1.NotFoundError();
});
app.use(common_1.errorHandler);
exports.default = app;
