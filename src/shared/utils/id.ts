import { ObjectId } from "bson";

export function generateId(): string {
  return new ObjectId().toString();
}
