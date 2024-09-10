"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import ERROR_MESSAGES from "@/lib/error_message";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: ERROR_MESSAGES.ERROR_REQUIRED,
    })
    .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGES.ERROR_TOO_SHORT)
    .regex(PASSWORD_REGEX, ERROR_MESSAGES.ERROR_PASSWORD_SECURITY),
});

export async function signIn(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const verifiedData = formSchema.safeParse(data);
  if (!verifiedData.success) return verifiedData.error.flatten();
}
