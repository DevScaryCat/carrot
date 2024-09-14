"use server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { checkBadword } from "@/lib/utils";
import ERROR_MESSAGES from "@/lib/error_message";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkPasswords = ({ password, confirmPassword }: { password: string; confirmPassword: string }) =>
  password === confirmPassword;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })
      .toLowerCase()
      .trim()
      .refine((username) => !checkBadword(username), ERROR_MESSAGES.ERROR_BADWORD),
    email: z.string().email().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const verifiedData = await formSchema.spa(data);
  // sefaParseAsync를 사용하는이유는 DB에서 유저와 이메일이 사용중인지 체크(통신/ 기다림)해야하기때문에 사용한다.
  if (!verifiedData.success) return verifiedData.error.flatten();
  else {
    const hashedPassword = await bcrypt.hash(verifiedData.data.password, 12);
    const user = await db.user.create({
      data: {
        username: verifiedData.data.username,
        email: verifiedData.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/profile");
  }
}
