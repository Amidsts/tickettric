import { Document, model, Schema } from "mongoose";
import OrderModel, { OrderStatus } from "./orders.model";
import { string } from "zod";

export interface TicketDoc extends Document {
  _id: string;
  title: string;
  price: number;
  orderId?: string;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new Schema<TicketDoc>(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    orderId: String,
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

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await OrderModel.findOne({
    ticket: this,
    status: { $ne: OrderStatus.Canceled },
  });

  return !!existingOrder;
};

const TicketModel = model<TicketDoc>("Ticket", ticketSchema);
export default TicketModel;
