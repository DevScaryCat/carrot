"use server";
import { z } from "zod";
import { checkBadword, checkPasswords } from "@/lib/utils";
import ERROR_MESSAGES from "@/lib/error_message";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";

const formSchema = z
  .object({
    username: z
      .string({
        required_error: ERROR_MESSAGES.ERROR_REQUIRED,
      })
      .toLowerCase()
      .trim()
      .refine((username) => !checkBadword(username), ERROR_MESSAGES.ERROR_BADWORD),
    email: z.string().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGES.ERROR_TOO_SHORT)
      .regex(PASSWORD_REGEX, ERROR_MESSAGES.ERROR_PASSWORD_SECURITY),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH, ERROR_MESSAGES.ERROR_TOO_SHORT),
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
    confirmPassword: formData.get("confirmPassword"),
  };
  const verifiedData = formSchema.safeParse(data);
  if (!verifiedData.success) return verifiedData.error.flatten();
  else console.log(verifiedData.data);
}
