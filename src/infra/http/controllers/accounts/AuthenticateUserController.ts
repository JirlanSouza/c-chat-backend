import { GetUserInfoQuery } from '@application/accounts/queries/GetuserInfo';
import { AuthenticateUserUseCase } from '@application/accounts/useCases/AuthenticateUser';
import { RegisterUserUseCase } from '@application/accounts/useCases/RegisterUser';
import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthenticateUserDto } from './Dtos/AutehticateUserDto';
import { RegisterUserDto } from './Dtos/RegisterUserDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getUserInfoQuery: GetUserInfoQuery,
  ) {}

  @Post()
  async registerUser(@Body() body: RegisterUserDto) {
    await this.registerUserUseCase.execute({
      ...body,
    });
  }

  @Post()
  async authenticateUser(@Body() body: AuthenticateUserDto) {
    const authenticationData = await this.authenticateUserUseCase.execute({
      ...body,
    });

    return authenticationData;
  }

  @Get('profile')
  async userProfile(@Request() request) {
    const userId = request.user.id;
    const getUserInfoResult = await this.getUserInfoQuery.execute(userId);
    return getUserInfoResult;
  }
}
