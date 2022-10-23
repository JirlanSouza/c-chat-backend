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
import { errorVerification } from "@infra/http/middlewares/errorVerification";
import { AuthenticateUserUseCase } from "@application/accounts/useCases/AuthenticateUser";
import { AuthenticateUserController } from "@infra/http/controllers/accounts/AuthenticateUserController";
import { NewMessageUseCase } from "@application/chat/useCases/NewMessage";
import { NewMessageEventHandler } from "@infra/webSocket/events/handlers/newMessageEvent";
import { SocketIoEventGatway } from "@infra/webSocket/events/eventGatway";
import { logger } from "@infra/http/middlewares/logger";
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
import { HttpEnsureAuthenticated } from "@infra/http/middlewares/ensureAuthenticated";
import { GetUserRoomIdListQuery } from "@application/chat/queries/GetUserRoomIdList";
import { notFound } from "@infra/http/middlewares/notFound";
import { AddUserToRoomUseCase } from "@application/chat/useCases/AddUserToRoom";
import { AddUserToRoomController } from "@infra/http/controllers/chat/AddUserToRoom";
import { Mediator } from "@application/mediator/Mediator";
import { NewUserAddedToRoomEventHandler } from "@infra/webSocket/events/handlers/newUserAddedToRoom";
import { GetUserInfoQuery } from "@application/accounts/queries/GetuserInfo";
import { GetUserInfoController } from "@infra/http/controllers/accounts/GetuserInfo";
import { PrismaMessageFileRepository } from "@infra/database/repositories/chat/PrismaMessageFileRepository";
import { UploadMessageFileUseCase } from "@application/chat/useCases/UploadMessageFile";
import { GoogleCloudStorageGatway } from "@infra/storage/GoogleCloudStorageGatway";
import { UploadMessageFileEventHandler } from "@infra/webSocket/events/handlers/uploadMessageFileEvent";
import { GenerateFileDownloadUrlUseCase } from "@application/chat/useCases/generateFileDownloadUrl";
import { GenerateFileDownloadUrlController } from "@infra/http/controllers/chat/GenerateFileDownloadUrl";

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
    maxHttpBufferSize: 1e8,
  });
  const expressHttpServer = new ExpressHttpServer(expressApp);
  const mediator = new Mediator();
  const storageGatway = new GoogleCloudStorageGatway();

  const usersRepository = new PrismaUsersrepository();
  const chatRepository = new PrismaChatRepository();
  const messageFileRepository = new PrismaMessageFileRepository();
  const verifyAuthentication = new VerifyAuthenticationUseCase(usersRepository);
  const webSocketEnsureAuthenticated = new WebSocketEnsureAuthenticated(verifyAuthentication);
  const httpEnsureAuthenticated = new HttpEnsureAuthenticated(verifyAuthentication);
  socketIo.use(webSocketEnsureAuthenticated.handler.bind(webSocketEnsureAuthenticated));

  const getUserRoomIdListQuery = new GetUserRoomIdListQuery(chatRepository);
  const socketIoEventEmitterGatway = new SocketIoEventGatway(socketIo, getUserRoomIdListQuery);

  const registerUserUsecase = new RegisterUserUseCase(usersRepository);
  new RegisterUserController(expressHttpServer, registerUserUsecase);

  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  new AuthenticateUserController(expressHttpServer, authenticateUserUseCase);

  const getuserInfoQuery = new GetUserInfoQuery(usersRepository);
  expressHttpServer.setMeddleware(httpEnsureAuthenticated.handler.bind(httpEnsureAuthenticated));
  new GetUserInfoController(expressHttpServer, getuserInfoQuery);

  const createRoomUseCase = new CreateRoomUseCase(usersRepository, chatRepository);
  expressHttpServer.setMeddleware(httpEnsureAuthenticated.handler.bind(httpEnsureAuthenticated));
  new CreateRoomController(expressHttpServer, createRoomUseCase);

  const addUserToRoomUseCase = new AddUserToRoomUseCase(usersRepository, chatRepository, mediator);
  expressHttpServer.setMeddleware(httpEnsureAuthenticated.handler.bind(httpEnsureAuthenticated));
  new AddUserToRoomController(expressHttpServer, addUserToRoomUseCase);

  const getLastRoomMessageQuery = new GetLastRoomMessagesQuery(chatRepository);
  new GetLastRoomMessagesController(expressHttpServer, getLastRoomMessageQuery);

  const getRoomListQuery = new GetRoomListQuery(chatRepository);
  new GetRoomLisController(expressHttpServer, getRoomListQuery);

  const generateFileDownloadurlUseCase = new GenerateFileDownloadUrlUseCase(
    messageFileRepository,
    storageGatway
  );
  expressHttpServer.setMeddleware(httpEnsureAuthenticated.handler.bind(httpEnsureAuthenticated));
  new GenerateFileDownloadUrlController(expressHttpServer, generateFileDownloadurlUseCase);

  const newMessageUseCase = new NewMessageUseCase(
    chatRepository,
    messageFileRepository,
    usersRepository
  );
  const uploadMessageFileUsecase = new UploadMessageFileUseCase(
    messageFileRepository,
    storageGatway
  );

  new NewMessageEventHandler(socketIoEventEmitterGatway, newMessageUseCase);
  new NewUserAddedToRoomEventHandler(socketIoEventEmitterGatway, mediator);
  new UploadMessageFileEventHandler(socketIoEventEmitterGatway, uploadMessageFileUsecase);

  socketIoEventEmitterGatway.onEvents();
  expressApp.use(errorVerification);
  expressApp.use(notFound);

  const port = parseInt(process.env.PORT) || 8082;
  httpServer.listen(port, () => console.info(`Server is runing in ${port} port!`));
})().catch((err) => {
  Logger.error(err);
});
