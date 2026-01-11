import { Controller, Post, Body, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login-auth.dto';
import { Role } from '../../common/enums/role.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import type { UserActiveInterface } from '../../common/interfaces/user-active.interface';
import { ApiBasicAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(
    @Body()
    createAuthDto: CreateAuthDto,
  ) {
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
  @ApiBasicAuth()
  @Get('profile')
  @Auth(Role.VENDEDOR)
  profile(@ActiveUser() user: UserActiveInterface) {
    return this.authService.profile(user);
  }
}
