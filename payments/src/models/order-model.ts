import { OrderStatus } from "@amidsttickets/common";
import { Document, model, Schema } from "mongoose";

interface IOrder extends Document {
  _id: string;
  userId: string;
  price: number;
  status: OrderStatus;
}

const orderSchema = new Schema<IOrder>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: Object.values(OrderStatus) },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const OrderModel = model<IOrder>("Order", orderSchema);
export default OrderModel;
