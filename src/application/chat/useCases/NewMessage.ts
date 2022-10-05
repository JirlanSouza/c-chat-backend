import { ChatMessage } from "@domain/entities/ChatMessage";
import { NewMessageInDto, NewMessageOutDto } from "../dtos/NewMessageTDO";

export class NewMessageUseCase {
  async execute(data: NewMessageInDto): Promise<NewMessageOutDto> {
    const message = ChatMessage.create(data.userId, data.text);
    return { ...message, created: message.created.toLocaleString("pt-br") };
  }
}
