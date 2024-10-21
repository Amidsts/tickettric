import request from "supertest";
import app from "../../app";


it('clears the cookie after a user signout', async () => {
      await request(app)
        .post("/api/users/signup")
        .send({ email: "ihsfhftd@email.com", password: "shbbakii" })
        .expect(201);

      await request(app)
        .post("/api/users/signout")
        .send({})
        .expect(200);
})