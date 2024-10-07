import { Document, model, Schema } from "mongoose";
import OrderModel, { OrderStatus } from "./orders.model";

export interface TicketDoc extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new Schema<TicketDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
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

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await OrderModel.findOne({
    ticket: this,
    status: { $ne: OrderStatus.Canceled },
  });

  return !!existingOrder;
};

const TicketModel = model<TicketDoc>("Ticket", ticketSchema);
export default TicketModel;
