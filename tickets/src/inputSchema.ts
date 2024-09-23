import z from "zod";

export const newTicketSchema = z.object({
  title: z.string(),
  price: z.number().gt(0),
});

export const showTicketSchema = z.object({
  ticketId: z.string()
});
