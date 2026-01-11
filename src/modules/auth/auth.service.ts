import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcryptjs from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({
    name,
    email,
    password,
    role,
    cedula,
    phone,
    lastname,
  }: CreateAuthDto) {
    const userByEmail = await this.usersService.findOneByEmail(email);
    const userByCedula = await this.usersService.findOneByCedula(cedula);
    if (userByEmail || userByCedula) {
      throw new BadRequestException('El usuario ya existe');
    }
    await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 15),
      role,
      cedula,
      phone,
      lastname,
    });
    return {
      message: 'Registro exitoso',
    };
  }

  async login({ cedula, password }: LoginDto) {
    const user = await this.usersService.findOneByCedulaWithPassword(cedula);
    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      sub: user.id,
      cedula: user.cedula,
      role: user.role.name,
    };
    const token = await this.jwtService.signAsync(payload);
    const { password: _, ...userWithoutPassword } = user;

    return {
      cedula: userWithoutPassword.cedula,
      token,
    };
  }

  async profile({ cedula, role }: { cedula: string; role: string }) {
    const Profile = await this.usersService.findOneByCedula(cedula);
    return {
      message: 'Perfil encontrado',
      data: Profile,
    };
  }
}
