import { generateId } from "@shared/utils/id";

export class File {
  id: string;
  name: string;
  type: string;
  size: number;
  available: boolean;
  url: string;

  private constructor(
    id: string,
    name: string,
    type: string,
    size: number,
    available: boolean,
    url: string
  ) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.available = available;
    this.url = url;
  }

  static create(name: string, type: string, size: number, available = false, url = ""): File {
    const id = generateId();
    return new File(id, name, type, size, available, url);
  }

  static from(
    id: string,
    name: string,
    type: string,
    size: number,
    available: boolean,
    url: string
  ): File {
    return new File(id, name, type, size, available, url);
  }

  updateUrl(url: string): void {
    this.url = url;
  }
}
