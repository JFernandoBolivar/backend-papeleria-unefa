import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { Request } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { AuthGuard } from './guard/auth.guard';
import { request } from 'http';

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
  @UseGuards(AuthGuard)
  @Get('profile')
  profile(
    @Request()
    request: Request,
  ) {
    return request['user'];
  }
}
