export class AppEventError extends Error {
  constructor(readonly message: string, readonly userId: string) {
    super(message);
  }
}
