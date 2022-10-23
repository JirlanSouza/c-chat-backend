import { generateId } from "@shared/utils/id";

export class File {
  id: string;
  name: string;
  type: string;
  size: number;
  available: boolean;

  private constructor(id: string, name: string, type: string, size: number, available: boolean) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.type = type;
    this.available = available;
  }

  static create(name: string, type: string, size: number, available = false): File {
    const id = generateId();
    return new File(id, name, type, size, available);
  }

  static from(id: string, name: string, type: string, size: number, available: boolean): File {
    return new File(id, name, type, size, available);
  }

  updateAvailable(isAvailable: boolean): void {
    this.available = isAvailable;
  }
}
