import { UsersRepository } from "@application/accounts/repositories/UsersRepository";
import { ChatRepository } from "@application/chat/repositories/ChatRepository";
import { CreateRoomUseCase } from "@application/chat/useCases/CreateRoom";
import { User } from "@domain/entities/User";
import { ChatInMemoryRepository } from "@infra/database/repositories/chat/ChatInMemoryRepository";
import { UsersInMemoryRepository } from "@infra/database/repositories/users/UsersInMemoryRepository";

let usersInMemoryRepository: UsersRepository;
let chatInMemoryRepository: ChatRepository;
let createRoomUseCase: CreateRoomUseCase;

describe("CreateRoomUseCase", () => {
  beforeEach(() => {
    usersInMemoryRepository = new UsersInMemoryRepository();
    chatInMemoryRepository = new ChatInMemoryRepository();
    createRoomUseCase = new CreateRoomUseCase(usersInMemoryRepository, chatInMemoryRepository);
  });

  it("Should be able create a new room", async () => {
    const user = await User.create("new user", "newuser@chat.com", "newuserpassword", "");
    usersInMemoryRepository.save(user);
    const roomData = { userId: user.id, roomName: "new room" };

    const cretadRoomData = await createRoomUseCase.execute(roomData);

    expect(cretadRoomData.id).toBeDefined();
    expect(cretadRoomData.name).toBe(roomData.roomName);
    expect(cretadRoomData.avatarUrl).toBe("");
    expect(cretadRoomData.lastMessageDatetime).toBe("");
  });
});
