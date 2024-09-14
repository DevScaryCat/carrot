"use server";

import db from "@/lib/db";
// import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import ERROR_MESSAGES from "@/lib/error_message";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z.string().email().toLowerCase().refine(checkEmailExists, ERROR_MESSAGES.ERROR_NOT_EXIST_EMAIL),
  password: z.string({
    required_error: ERROR_MESSAGES.ERROR_REQUIRED,
  }),
  // .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGES.ERROR_TOO_SHORT)
  // .regex(PASSWORD_REGEX, ERROR_MESSAGES.ERROR_PASSWORD_SECURITY),
});

export async function signIn(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const verifiedData = await formSchema.safeParseAsync(data);
  if (!verifiedData.success) return verifiedData.error.flatten();
  else {
    const user = await db.user.findUnique({
      where: {
        email: verifiedData.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(verifiedData.data.password, user!.password ?? "");
    if (ok) {
      const session = await getSession();
      session.id = user?.id;
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["Wrong password"],
          email: [],
        },
      };
    }
  }
}
