import { hash } from "bcrypt";

export async function toHash(data: string) {
  return await hash(data, 8);
}
