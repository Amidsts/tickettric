import request from "supertest";
import app from "../../app";

it("fails, when an email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "bfyhdy@email.com", password: "syrgha" })
    .expect(400);
});

it("fails for an incorrect password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "ihsfhftd@email.com", password: "shbbakii" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "ihsfhftd@email.com", password: "syrgha" })
    .expect(400);
});

it("respond with a cookie when given a valid credential", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "ihsfhftd@email.com", password: "shbbakii" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "ihsfhftd@email.com", password: "shbbakii" })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined()
});