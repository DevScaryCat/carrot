"use server";

import { z } from "zod";

const productSchema = z.object({
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

export async function UploadProduct(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
}
