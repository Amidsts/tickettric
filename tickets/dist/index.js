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
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const prisma = new client_1.PrismaClient();
dotenv_1.default.config({ path: ".env.test" });
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_KEY) {
        throw Error("JWT_KEY must be defined");
    }
    prisma
        .$connect()
        .then(() => {
        console.log("connected to mysql database");
        console.log(process.env.DATABASE_URL);
        app_1.default.listen(2000, () => {
            console.log("server is listening on 2000!");
        });
    })
        .catch((error) => {
        console.log("Error connecting to db: ", error);
    });
});
start();
