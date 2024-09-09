"use server";
import { z } from "zod";
import { checkBadword, checkPasswords } from "@/lib/utils";
import ERROR_MESSAGES from "@/lib/error_message";

const passwordRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/);

const formSchema = z
  .object({
    username: z
      .string({
        required_error: ERROR_MESSAGES.ERROR_REQUIRED,
      })
      .min(3, ERROR_MESSAGES.ERROR_TOO_SHORT)
      .max(10, ERROR_MESSAGES.ERROR_TOO_LOONG)
      .toLowerCase()
      .trim()
      .refine((username) => !checkBadword(username), ERROR_MESSAGES.ERROR_BADWORD),
    email: z.string().toLowerCase(),
    password: z
      .string()
      .min(10, ERROR_MESSAGES.ERROR_TOO_SHORT)
      .regex(passwordRegex, ERROR_MESSAGES.ERROR_PASSWORD_SECURITY),
    confirm_password: z.string().min(10, ERROR_MESSAGES.ERROR_TOO_SHORT),
  })
  .refine(checkPasswords, {
    message: ERROR_MESSAGES.ERROR_PASSWORD_MATCH,
    path: ["password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
