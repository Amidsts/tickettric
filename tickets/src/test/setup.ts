import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("TESTING............");
    console.log("dbb:   ", process.env.DATABASE_URL);
  }
  process.env.JWT_KEY = "asdfasdf";
  //connect to db
});

beforeEach(async () => {
  await prisma.ticket.deleteMany();
});

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
