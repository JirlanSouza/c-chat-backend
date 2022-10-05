import { NewMessageUseCase } from "@application/chat/useCases/NewMessage";
import { EventHandlerOut } from "./types";

type NewMessageEventData = { userId: string; text: string };

export class NewMessageEventHandler {
  constructor(private newMessageUsecase: NewMessageUseCase) {}

  async handler(eventData: NewMessageEventData): Promise<EventHandlerOut> {
    const { userId, text } = eventData;
    const newMessageresult = await this.newMessageUsecase.execute({ userId, text });

    return {
      emitAll: true,
      data: newMessageresult,
    };
  }
}
