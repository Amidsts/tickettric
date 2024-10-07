import { Document, Model, model, Schema } from "mongoose";
import { OrderStatus } from "@amidsttickets/common";
import { TicketDoc } from "./ticket.model";

export { OrderStatus };

export interface OrderDoc extends Document {
  ticket: TicketDoc;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
}

const orderSchema = new Schema<OrderDoc>(
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
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Ticket",
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

const OrderModel = model<OrderDoc>("Order", orderSchema);
export default OrderModel;
