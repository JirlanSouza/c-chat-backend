import { ObjectId } from "bson";

export function generateId(): string {
  return new ObjectId().toString();
}

export function isValidId(id: string): boolean {
  return ObjectId.isValid(id);
}
