import { Document, model, Schema } from "mongoose";

interface IPayment extends Document {
  orderId: string;
  stripeId: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true },
    stripeId: { type: String, required: true },
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

const PaymentModel = model<IPayment>("Payment", paymentSchema);

export default PaymentModel;
