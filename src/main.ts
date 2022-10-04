import "express-async-errors";
import express from "express";
import { config } from "dotenv";

import { RegisterUserUseCase } from "@application/accounts/useCases/RegisterUser";
import { PrismaUsersrepository } from "@infra/database/repositories/users/PrismausersRepository";
import { RegisterUserController } from "@infra/http/controllers/accounts/RegisterUserController";
import { ExpressHttpServer } from "@infra/http/server/ExpressHttpServer";
import { Db } from "@infra/database/conection";
import { errorVerification } from "@infra/http/midllewares/errorVerification";
import { AuthenticateUserUseCase } from "@application/accounts/useCases/AuthenticateUser";
import { AuthenticateUserController } from "@infra/http/controllers/accounts/AuthenticateUserController";

(async () => {
  config();
  await Db.connect();
  const expressApp = express();
  expressApp.use(express.json());
  const httpServer = new ExpressHttpServer(expressApp);
  const usersRepository = new PrismaUsersrepository();
  const registerUserUsecase = new RegisterUserUseCase(usersRepository);

  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

  new RegisterUserController(httpServer, registerUserUsecase);
  new AuthenticateUserController(httpServer, authenticateUserUseCase);

  expressApp.use(errorVerification);
  const port = parseInt(process.env.PORT) || 8080;
  httpServer.listener(port, () => console.info(`Server is runing in ${port} port!`));
})();
