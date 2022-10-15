import "express-async-errors";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";

import { RegisterUserUseCase } from "@application/accounts/useCases/RegisterUser";
import { PrismaUsersrepository } from "@infra/database/repositories/users/PrismaUsersRepository";
import { RegisterUserController } from "@infra/http/controllers/accounts/RegisterUserController";
import { ExpressHttpServer } from "@infra/http/server/ExpressHttpServer";
import { Db } from "@infra/database/conection";
import { errorVerification } from "@infra/http/midllewares/errorVerification";
import { AuthenticateUserUseCase } from "@application/accounts/useCases/AuthenticateUser";
import { AuthenticateUserController } from "@infra/http/controllers/accounts/AuthenticateUserController";
import { NewMessageUseCase } from "@application/chat/useCases/NewMessage";
import { NewMessageEventHandler } from "@infra/webSocket/events/handlers/newMessageEventHandler";
import { SocketIoEventGatway } from "@infra/webSocket/events/eventGatway";
import { logger } from "@infra/http/midllewares/logger";
import { PrismaChatRepository } from "@infra/database/repositories/chat/PrismaChatRepository";
import { WebSocketEnsureAuthenticated } from "@infra/webSocket/middlewares/ensureAuthenticated";
import { VerifyAuthenticationUseCase } from "@application/accounts/useCases/VerifyAuthentication";
import { GetLastRoomMessagesQuery } from "@application/chat/queries/GetLastRoomMessages";
import { GetLastRoomMessagesController } from "@infra/http/controllers/chat/GetLastRoomMessages";
import { GetRoomListQuery } from "@application/chat/queries/GetRoomList";
import { GetRoomLisController } from "@infra/http/controllers/chat/GetRoomList";
import { Logger } from "@shared/logger";
import { CreateRoomUseCase } from "@application/chat/useCases/CreateRoom";
import { CreateRoomController } from "@infra/http/controllers/chat/CreateRoom";
import { HttpEnsureAuthenticated } from "@infra/http/midllewares/ensureAuthenticated";
import { GetUserRoomIdListQuery } from "@application/chat/queries/GetUserRoomIdList";

(async () => {
  config();
  await Db.connect();

  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(cors());
  expressApp.use(logger);
  const httpServer = createServer(expressApp);
  const socketIo = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });
  const expressHttpServer = new ExpressHttpServer(expressApp);

  const usersRepository = new PrismaUsersrepository();
  const chatRepository = new PrismaChatRepository();
  const verifyAuthentication = new VerifyAuthenticationUseCase(usersRepository);
  const webSocketEnsureAuthenticated = new WebSocketEnsureAuthenticated(verifyAuthentication);
  const httpEnsureAuthenticated = new HttpEnsureAuthenticated(verifyAuthentication);

  socketIo.use(webSocketEnsureAuthenticated.handler.bind(webSocketEnsureAuthenticated));
  const getUserRoomIdListQuery = new GetUserRoomIdListQuery(chatRepository);
  const socketIoEventEmitterGatway = new SocketIoEventGatway(socketIo, getUserRoomIdListQuery);

  const registerUserUsecase = new RegisterUserUseCase(usersRepository);
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  new RegisterUserController(expressHttpServer, registerUserUsecase);
  new AuthenticateUserController(expressHttpServer, authenticateUserUseCase);

  const createRoomuseCase = new CreateRoomUseCase(usersRepository, chatRepository);
  expressHttpServer.setMeddleware(httpEnsureAuthenticated.handler.bind(httpEnsureAuthenticated));
  new CreateRoomController(expressHttpServer, createRoomuseCase);

  const getLastRoomMessageQuery = new GetLastRoomMessagesQuery(chatRepository);
  new GetLastRoomMessagesController(expressHttpServer, getLastRoomMessageQuery);

  const getRoomListQuery = new GetRoomListQuery(chatRepository);
  new GetRoomLisController(expressHttpServer, getRoomListQuery);

  const newMessageUseCase = new NewMessageUseCase(chatRepository, usersRepository);
  new NewMessageEventHandler(socketIoEventEmitterGatway, newMessageUseCase);

  socketIoEventEmitterGatway.onEvents();
  expressApp.use(errorVerification);

  const port = parseInt(process.env.PORT) || 8082;
  httpServer.listen(port, () => console.info(`Server is runing in ${port} port!`));
})().catch((err) => {
  Logger.error(err);
});
