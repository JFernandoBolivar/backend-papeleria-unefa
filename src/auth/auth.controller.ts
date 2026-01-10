import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { AuthGuard } from './guard/auth.guard';
import type { Request } from 'express';
import { Role } from './enums/role.enum';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Auth } from './decorators/auth.decorator';

interface RequestWithUser extends Request {
  user: {
    cedula: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(
    @Body()
    createAuthDto: CreateAuthDto,
  ) {
    console.log(createAuthDto);
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(
    @Body()
    LoginDto: LoginDto,
  ) {
    return this.authService.login(LoginDto);
  }

  // @Get('profile')
  // @Roles(Role.ADMINISTRADOR)
  // @UseGuards(AuthGuard, RolesGuard)
  // profile(
  //   @Req()
  //   req: RequestWithUser,
  // ) {
  //   return req['user'];
  // }

  @Get('profile')
  @Auth(Role.ADMINISTRADOR)
  profile(
    @Req()
    req: RequestWithUser,
  ) {
    return req['user'];
  }
}
