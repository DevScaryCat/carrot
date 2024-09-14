import { Filter } from "bad-words";

export function checkBadword(text: string) {
  const filter = new Filter();
  return filter.isProfane(text);
}
