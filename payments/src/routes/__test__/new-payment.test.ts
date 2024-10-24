import OrderModel from "../../models/order-model";
import app from "../../app";
import request from "supertest";
import mongoose from "mongoose";
import { OrderStatus } from "@amidsttickets/common";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", (global as any).signin())
    .send({ token: "sjnkeur", orderId: "dskjerui" })
    .expect(404);
});

it("returns 401 when purchasing an order that does not belong to the user", async () => {
  const order = await new OrderModel({
    _id: new mongoose.Types.ObjectId(),
    userId: new mongoose.Types.ObjectId(),
    price: 40,
    status: OrderStatus.Created,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", (global as any).signin())
    .send({ token: "sjnkeur", orderId: order.id })
    .expect(401);
});

it("return 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId();
  const order = await new OrderModel({
    _id: new mongoose.Types.ObjectId(),
    userId: userId,
    price: 40,
    status: OrderStatus.Canceled,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", (global as any).signin(userId))
    .send({ token: "sjnkeur", orderId: order.id })
    .expect(400);
});

it("return a 201 with valid input", async () => {
  const userId = new mongoose.Types.ObjectId();
  const order = await new OrderModel({
    _id: new mongoose.Types.ObjectId(),
    userId,
    price: 40,
    status: OrderStatus.Created,
  }).save();

  const res = await request(app)
    .post("/api/payments")
    .set("Cookie", (global as any).signin(userId))
    .send({ token: "tok_visa", orderId: order.id })
    .expect(201);
  // console.log(res.body);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(order.price * 100);
});
