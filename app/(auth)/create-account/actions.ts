"use server";

import PrismaDB from "@/lib/db";
import { PASSWORD_REGEX, PASSWORD_MIN_LENGTH, PASSWORD_REGEX_ERROR } from "@/lib/projectCommon";
import { z } from "zod";
import bcrypt from "bcrypt";
import UpdateSession from "@/lib/session/updateSession";

function validateUsername(username: string) {
  const restrictWords = ["master", "admin", "potato", "운영자"];

  for (let word of restrictWords) {
    if (username.includes(word)) return false;
  }
  return true;
}

function validatePassword({ password, confirm_password }: { password: string; confirm_password: string }) {
  return password === confirm_password;
}

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username have to be a string",
        required_error: "Please enter a username",
      })
      .trim()
      .refine(validateUsername, "Included not allowed word"),

    email: z.string().email(),

    password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async (data, ctx) => {
    const user = await PrismaDB.user.findUnique({
      where: {
        username: data.username,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already exist",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async (data, ctx) => {
    const user = await PrismaDB.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already exist",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(validatePassword, {
    message: "Both password and confirm_password must be the same",
    path: ["confirm_password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await PrismaDB.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    await UpdateSession(user.id);
  }
}
