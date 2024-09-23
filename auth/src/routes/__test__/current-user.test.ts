import request from "supertest";
import app from "../../app";

it("return details about the current logged-in user", async () => {
  const cookie = await (global as any).signup();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie!)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("respond with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
