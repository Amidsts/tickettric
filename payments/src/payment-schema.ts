import z from "zod";

export const newPaymentSchema = z.object({
  token: z.string(),
  orderId: z.string(),
});
