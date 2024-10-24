import request from "supertest";
import app from "../../app";

it("returns a status code 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "dbhm@email.com", password: "sbhrikae" })
    .expect(201);
});

it("returns a status code 400 for an invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "dbhm", password: "sbhrikae" })
    .expect(400);
});

it("returns a status code 400 for an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "dbhmdjejoi@email.com", password: "sw" })
    .expect(400);
});

it("returns a status code 400 for missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "ihsd@email.com" })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ password: "shbbeyriaki" })
    .expect(400);
});

it("disallow duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "ihsfhftd@email.com", password: "shbbauki" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "ihsfhftd@email.com", password: "shbbakii" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "ihsd@email.com", password: "shbbakii" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
