import request from "supertest";
import app from "../../app";

it("should return 404 if the ticket is not found", async () => {
  await request(app).get("/api/tickets/sjhdwkug").send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", (global as any).signin())
    .send({ title: "footbal", price: 90 })
    .expect(200);

  const response = await request(app).get(`/api/tickets/${res.body.id}`).send();

  expect(res.status).toBe(200);
});
