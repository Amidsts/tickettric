import request from "supertest";
import app from "../../app";

it('has a route handler for "/api/tickets for post request', async () => {});

it("authourised only logged in user", async () => {});

it("returns an error for invalid title", async () => {});

it("returns an error for invalid price", async () => {});

it('it has a route handler for "/api/tickets for post request', async () => {});

it("create a ticket with valid parameters", async () => {
  return request(app)
    .post("/api/tickets")
    .send({ title: "footbal", price: "90" })
    .expect(200);
});
