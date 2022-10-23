import { NewMessageUseCase } from "@application/chat/useCases/NewMessage";
import { EventEmitterGatway } from "../EventEmitterGatway";
import { EventHandlerOut } from "./types";

interface NewMessageEventData {
  roomId;
  userId: string;
  text: string;
  files?: [];
}

export class NewMessageEventHandler {
  private readonly listenerEventName = "NEW_MESSAGE";
  private readonly emitEventName = "NEW_MESSAGE";

  constructor(
    private readonly eventEmitterGatway: EventEmitterGatway,
    private readonly newMessageUsecase: NewMessageUseCase
  ) {
    this.eventEmitterGatway.subscribeEvent(this.listenerEventName, this.handler.bind(this));
  }

  private async handler(eventData: NewMessageEventData): Promise<EventHandlerOut> {
    const { roomId, userId, text, files } = eventData;
    const newMessageresult = await this.newMessageUsecase.execute({ roomId, userId, text, files });

    return {
      emitAll: true,
      emitEventName: this.emitEventName,
      data: newMessageresult,
    };
  }
}
