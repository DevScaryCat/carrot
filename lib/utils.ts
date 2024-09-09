import { Filter } from "bad-words";

export function checkBadword(text: string) {
  const filter = new Filter();
  return filter.isProfane(text);
}

export const checkPasswords = ({ password, confirm_password }: { password: string; confirm_password: string }) =>
  password === confirm_password;
