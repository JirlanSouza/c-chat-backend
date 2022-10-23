import { UploadMessageFileUseCase } from "@application/chat/useCases/UploadMessageFile";
import { EventEmitterGatway } from "../EventEmitterGatway";
import { EventHandlerOut } from "./types";

interface UploadMessageFileEventData {
  roomId: string;
  fileId: string;
  data: ArrayBuffer;
}

export class UploadMessageFileEventHandler {
  private readonly listenerEventName = "UPLOAD_MESSAGE_FILE";
  private readonly emitEventName = "UPLOAD_MESSAGE_FILE_FINISH";

  constructor(
    private readonly eventEmitterGatway: EventEmitterGatway,
    private readonly uploadMessageFileUsecase: UploadMessageFileUseCase
  ) {
    this.eventEmitterGatway.subscribeEvent(this.listenerEventName, this.handler.bind(this));
  }

  private async handler(eventData: UploadMessageFileEventData): Promise<EventHandlerOut> {
    const { fileId, data } = eventData;
    const uploadMessageFileResult = await this.uploadMessageFileUsecase.execute({ fileId, data });

    return {
      emitAll: true,
      emitEventName: this.emitEventName,
      data: uploadMessageFileResult,
    };
  }
}
