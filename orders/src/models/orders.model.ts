import { Document, model, Schema } from "mongoose";
import { OrderStatus } from "@amidsttickets/common";

export enum orderEnum {}

interface OrderAttr extends Document {
  ticket: string;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
}

const orderSchema = new Schema<OrderAttr>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: String,
      required: true,
    },
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

const orderModel = model<OrderAttr>("order", orderSchema);
export default orderModel;
