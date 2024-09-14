"use server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { checkBadword, checkPasswords } from "@/lib/utils";
import ERROR_MESSAGES from "@/lib/error_message";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUserExist = async (username: string) => {
  const findUser = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(findUser);
  // Boolean() 함수는 매개변수로 사용되는 변수 혹은 표현식의 참/거짓 여부를 반환한다.
};
const checkEmailExist = async (email: string) => {
  const findEmail = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(findEmail);
  // Boolean() 함수는 매개변수로 사용되는 변수 혹은 표현식의 참/거짓 여부를 반환한다.
};

const formSchema = z
  .object({
    username: z
      .string({
        required_error: ERROR_MESSAGES.ERROR_REQUIRED,
      })
      .toLowerCase()
      .trim()
      .refine((username) => !checkBadword(username), ERROR_MESSAGES.ERROR_BADWORD)
      .refine(checkUserExist, ERROR_MESSAGES.ERROR_USERNAME_ALREADY_EXIST),
    email: z.string().toLowerCase().refine(checkEmailExist, ERROR_MESSAGES.ERROR_EMAIL_ALREADY_EXIST),
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
  const verifiedData = await formSchema.safeParseAsync(data);
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
