import { generateId } from "@shared/utils/id";

export class File {
  id: string;
  name: string;
  type: string;
  size: number;
  duration: number;
  data: ArrayBuffer;

  constructor(id: string, name: string, type: string, size: number, duration: number, data) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.duration = duration;
    this.data = data;
  }

  static create(name: string, type: string, size: number, duration: number, data): File {
    const id = generateId();
    return new File(id, name, type, size, duration, data);
  }
}
