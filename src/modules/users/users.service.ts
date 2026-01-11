import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save({
      ...createUserDto,
      role: {
        id: createUserDto.role,
      },
    });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOneByCedula(cedula: string) {
    return this.userRepository.findOneBy({ cedula });
  }
  findOneByCedulaWithPassword(cedula: string) {
    return this.userRepository.findOne({
      where: { cedula },
      select: [
        'id',
        'cedula',
        'phone',
        'lastname',
        'name',
        'email',
        'password',
      ],
      relations: ['role'],
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findByOne(id: number) {
    const user = await this.findOne(id);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const existUser = await this.findOne(id);
      const { role, ...rest } = updateUserDto;
      const dataToUpdate = {
        ...rest,
        role: role ? { id: role } : undefined,
      };
      const updateUser = this.userRepository.merge(existUser, dataToUpdate);
      const saveUser = await this.userRepository.save(updateUser);
      return saveUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Error update user with id ${id}`);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.userRepository.softDelete(id);
  }

  private async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Usuario with id ${id} not found`);
    }
    return user;
  }
}
