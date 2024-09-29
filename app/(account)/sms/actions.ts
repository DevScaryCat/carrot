"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import crypto from "crypto";
import twilio from "twilio";
import validator from "validator";
import PrismaDB from "@/lib/db";
import UpdateSession from "@/lib/session/updateSession";

interface IActionState {
  token: boolean;
  phone: string;
}

let PHONE_NUMBER = "";

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, "ko-KR"), "Wrong phone number format");

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(isTokenExist, "Token is invalid or expired")
  .refine(isPhoneNumberValid, "The phone number and token dose not match");

async function isTokenExist(token: number) {
  const exist = await PrismaDB.sMSToken.findUnique({
    where: {
      token: token + "",
    },
    select: {
      id: true,
    },
  });
  return Boolean(exist);
}

async function createToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exist = await PrismaDB.sMSToken.findUnique({
    where: {
      token: token,
    },
    select: {
      id: true,
    },
  });

  if (exist) {
    return createToken();
  } else {
    return token;
  }
}

async function isPhoneNumberValid(token: number) {
  const _token = await PrismaDB.sMSToken.findUnique({
    where: {
      token: token + "",
    },
    select: {
      phone: true,
    },
  });

  return _token?.phone === PHONE_NUMBER;
}

export async function SMSVerification(prevState: IActionState, formData: FormData) {
  const phone_number = formData.get("phone_number");
  const token = formData.get("token");

  console.log(`phone number is ${phone_number}`);

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone_number);
    console.log(result);
    if (!result.success) {
      return {
        token: false,
        phone: "",
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
      PHONE_NUMBER = result.data;

      const token = await createToken();
      await PrismaDB.sMSToken.create({
        data: {
          token: token,
          phone: result.data,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                phone: result.data,
                username: crypto.randomBytes(10).toString("hex"),
              },
            },
          },
        },
      });

      // 과금 결제 코드
      // const twilioClient = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN);
      // await twilioClient.messages.create({
      //   body: `Pepe market verification token is ${token}`,
      //   from: process.env.TWILIO_PHONE_NUMBER!,
      //   to: process.env.MY_PHONE_NUMBER!,
      // });

      return {
        token: true,
        phone: PHONE_NUMBER,
      };
    }
  } else {
    // current user puted a token
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        token: true,
        phone: prevState.phone,
        error: result.error.flatten(),
      };
    } else {
      // when the token putted by user is fine
      const token = await PrismaDB.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
          phone: true,
        },
      });

      await UpdateSession(token!.userId);
      await PrismaDB.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect("/profile");
    }
  }
}
