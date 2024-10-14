import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "photo is required",
  }),
  title: z.string({
    required_error: "title is required",
  }),
  description: z.string({
    required_error: "description is required",
  }),
  price: z.coerce.number({
    required_error: "price is required",
  }),
});

export type ProductType = z.infer<typeof productSchema>;
