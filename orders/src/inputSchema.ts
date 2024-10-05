import z from "zod";

export const newOrderSchema = z.object({
  ticketId: z.string(),
});
