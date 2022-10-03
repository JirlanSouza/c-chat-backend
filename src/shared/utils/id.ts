import { ObjectId } from "bson";

export function generateId() {
  return new ObjectId().toString();
}
