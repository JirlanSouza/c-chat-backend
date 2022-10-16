import { AddUserToRoomOutDto } from "@application/chat/dtos/AddUserToRoomDTO";
import { Mediator } from "@application/mediator/Mediator";
import { EventEmitterGatway } from "../EventEmitterGatway";

export class NewUserAddedToRoomEventHandler {
  private readonly listenerEventName = "USER_ADDED_IN_ROOM";
  private readonly emitEventName = "WAS_ADDED_TO_THE_ROOM";

  constructor(
    private readonly eventEmitterGatway: EventEmitterGatway,
    private readonly mediator: Mediator
  ) {
    this.mediator.subscribe(this.listenerEventName, this.handler.bind(this));
  }

  private async handler(eventData: AddUserToRoomOutDto): Promise<void> {
    this.eventEmitterGatway.emitToUser(eventData.userId, this.emitEventName, eventData);
  }
}
