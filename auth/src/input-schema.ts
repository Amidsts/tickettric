import z from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().length(8),
});


export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().length(8),
});
