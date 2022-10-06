import { NewMessageUseCase } from "@application/chat/useCases/NewMessage";
import { EventEmitterGatway } from "../EventEmitterGatway";
import { EventHandlerOut } from "./types";

type NewMessageEventData = { userId: string; text: string };

export class NewMessageEventHandler {
  private listenerEventName = "NEW_MESSAGE";
  private emitEventName = "NEW_MESSAGE";

  constructor(private eventEmitterGatway: EventEmitterGatway, private newMessageUsecase: NewMessageUseCase) {
    this.eventEmitterGatway.subscribeEvent(this.listenerEventName, this.handler.bind(this));
  }

  private async handler(eventData: NewMessageEventData): Promise<EventHandlerOut> {
    const { userId, text } = eventData;
    const newMessageresult = await this.newMessageUsecase.execute({ userId, text });

    return {
      emitAll: true,
      emitEventName: this.emitEventName,
      data: newMessageresult,
    };
  }
}
