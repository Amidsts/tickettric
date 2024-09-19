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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === "test") {
        console.log("TESTING............");
        console.log("dbb:   ", process.env.DATABASE_URL);
    }
    process.env.JWT_KEY = "asdfasdf";
    //connect to db
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.ticket.deleteMany();
}));
// afterAll(async () => {
//   await prisma.$disconnect()
// });
// (global as any).signup = async () => {
//   const response = await request(app)
//     .post("/api/users/signup")
//     .send({ email: "test@test.com", password: "password" })
//     .expect(201);
//   const cookie = response.get('Set-Cookie')
//   return cookie
// };
