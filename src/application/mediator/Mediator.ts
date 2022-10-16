type Handler = (data) => Promise<void>;

export class Mediator {
  private readonly subscribers: Map<string, Handler[]> = new Map();

  subscribe(eventName: string, handler: Handler): void {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, [handler]);
      return;
    }

    this.subscribers.get(eventName).push(handler);
  }

  async emit(eventName, data): Promise<void> {
    if (!this.subscribers.has(eventName)) {
      return;
    }

    const handlers = this.subscribers.get(eventName);

    for await (const handler of handlers) {
      handler(data);
    }
  }
}
