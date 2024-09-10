import { z } from "zod";
import validator from "validator";
import { CODE_MAX_LENGTH, CODE_MIN_LENGTH } from "@/lib/constants";
import { redirect } from "next/navigation";
import ERROR_MESSAGES from "@/lib/error_message";
const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, "ko-KR"), ERROR_MESSAGES.ERROR_PHONE_FORMAT);
const codeSchema = z.coerce.number().min(CODE_MIN_LENGTH).max(CODE_MAX_LENGTH);
// coerce는 유저가 입력한 string을 number로 변환하려고 시도한다.

interface ActionState {
  code: boolean;
}
export async function smsSignIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phoneNumber");
  const code = formData.get("code");
  if (!prevState.code) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        code: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        code: true,
      };
    }
  } else {
    const result = codeSchema.safeParse(code);
    if (!result.success) {
      return {
        code: true,
        error: result.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
}
