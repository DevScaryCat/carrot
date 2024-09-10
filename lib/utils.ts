import { Filter } from "bad-words";

export function checkBadword(text: string) {
  const filter = new Filter();
  return filter.isProfane(text);
}

export const checkPasswords = ({ password, confirmPassword }: { password: string; confirmPassword: string }) =>
  password === confirmPassword;
