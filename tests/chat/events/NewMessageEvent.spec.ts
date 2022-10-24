import { createServer } from "node:http";
import { Server } from "socket.io";
import client, { Socket as ClientSocket } from "socket.io-client";

import { GetUserRoomIdListQuery } from "@application/chat/queries/GetUserRoomIdList";
import { ChatRepository } from "@application/chat/repositories/ChatRepository";
import { NewMessageUseCase } from "@application/chat/useCases/NewMessage";
import { PrismaChatRepository } from "@infra/database/repositories/chat/PrismaChatRepository";
import { SocketIoEventGatway } from "@infra/webSocket/events/eventGatway";
import { NewMessageEventHandler } from "@infra/webSocket/events/handlers/newMessageEvent";
import { UsersRepository } from "@application/accounts/repositories/UsersRepository";
import { PrismaUsersrepository } from "@infra/database/repositories/users/PrismaUsersRepository";
import { AddressInfo } from "node:net";
import { VerifyAuthenticationUseCase } from "@application/accounts/useCases/VerifyAuthentication";
import { WebSocketEnsureAuthenticated } from "@infra/webSocket/middlewares/ensureAuthenticated";
import { Db } from "@infra/database/conection";

describe("NewMessageEvent", () => {
  let chatRepository: ChatRepository;
  let usersRepository: UsersRepository;
  let serverSocket: Server;
  let clientSocket: ClientSocket;

  beforeAll(Db.connect);

  beforeEach((done) => {
    chatRepository = new PrismaChatRepository();
    usersRepository = new PrismaUsersrepository();

    const httpServer = createServer();
    serverSocket = new Server(httpServer);
    const verifyAuthentication = new VerifyAuthenticationUseCase(usersRepository);
    const webSocketEnsureAuthenticated = new WebSocketEnsureAuthenticated(verifyAuthentication);
    serverSocket.use(webSocketEnsureAuthenticated.handler.bind(webSocketEnsureAuthenticated));
    const getUserRoomIdListQuery = new GetUserRoomIdListQuery(chatRepository);
    const socketIoEventEmitterGatway = new SocketIoEventGatway(
      serverSocket,
      getUserRoomIdListQuery
    );

    const newMessageUseCase = new NewMessageUseCase(chatRepository, usersRepository);
    new NewMessageEventHandler(socketIoEventEmitterGatway, newMessageUseCase);

    socketIoEventEmitterGatway.onEvents();
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      console.log(port);
      clientSocket = client(`http://localhost:${port}`, {
        auth: {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjU4NTIyMTEsImV4cCI6MTY2NTkzODYxMSwic3ViIjoiNjMzZjY3YjZhNTZmNGQ2OTE0YWM1OWNlIn0.WxJrw32eN6ylGviRDQaowVviOXgFw_mEJVZFE4hL-k4",
        },
      });

      clientSocket.on("connect", () => {
        console.log("Doning");
        done();
      });
    });
  });

  afterEach((done) => {
    clientSocket.close();
    serverSocket.close(done);
  });

  afterAll(Db.disconnect);

  it("Shold be albe create a new message", (done) => {
    clientSocket.on("NEW_MESSAGE", (eventMsg) => {
      expect(eventMsg["roomId"]).toBe("6348c60fdce94c3537631f0c");
      expect(eventMsg["user"]["id"]).toBe("633f67b6a56f4d6914ac59ce");
      expect(eventMsg["text"]).toBe("Ok");
      done();
    });

    clientSocket.emit("NEW_MESSAGE", {
      roomId: "6348c60fdce94c3537631f0c",
      userId: "633f67b6a56f4d6914ac59ce",
      text: "Ok",
    });
  });
});
