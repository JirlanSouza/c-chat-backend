import { hash } from 'bcrypt';

export async function toHash(data: string): Promise<string> {
  return hash(data, 8);
}
