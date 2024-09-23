"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import crypto from "crypto";
import twilio from "twilio";
import PrismaDB from "@/lib/db";
import UpdateSession from "@/lib/session/updateSession";

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, "ko-KR"), "Wroung phone number format");

async function tokenExists(token: number) {
  const exists = await PrismaDB.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

const tokenSchema = z.coerce.number().min(100000).max(999999).refine(tokenExists, "this token does not exist");

interface IActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await PrismaDB.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}
export async function SMSVerification(prevState: IActionState, formData: FormData) {
  const phone = formData.get("phone_number");
  const token = formData.get("token");
  console.log(phone);
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      await PrismaDB.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      const token = await getToken();
      await PrismaDB.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your Karrot verification code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!,
      });
      return {
        token: true,
      };
    }
  } else {
    const result = await tokenSchema.spa(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      const token = await PrismaDB.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });

      UpdateSession(Number(token?.userId));
      await PrismaDB.sMSToken.delete({
        where: {
          id: token?.id,
        },
      });
      redirect("/");
    }
  }
}
