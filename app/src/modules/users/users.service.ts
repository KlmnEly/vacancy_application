import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/response-user.dto';
import { UserAuthResponseDto } from './dto/response-user-auth.dto';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  private toResponseDto(user: User): UserResponseDto {
    return {
      idUser: user.idUser,
      fullname: user.fullname,
      email: user.email,
      created_at: user.createdAt,
      role: {
        idRole: user.role.idRole,
        name: user.role.name
      }
    };
  }

  private toAuthResponseDto(user: User): UserAuthResponseDto {
    return {
      idUser: user.idUser,
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      role: {
        idRole: user.role.idRole,
        name: user.role.name,
      },
    };
  }

  async createUser(userDto: CreateUserDto): Promise<UserResponseDto> {
        const existing = await this.userRepository.findOne({
            where: { email: userDto.email }
        });

        if (existing) {
            throw new ConflictException(`The user with email ${userDto.email} already exists`);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userDto.password, salt);

        const newUser = this.userRepository.create({
            ...userDto,
            password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(newUser);
        return this.findOneById(savedUser.idUser);
    }

  async findAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find({ relations: ['role'] });
        return users.map(user => this.toResponseDto(user));
    }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
            where: { idUser: id, isActive: true },
            relations: ['role'],
        });

        if (!user) throw new NotFoundException(`ID ${id} not found`);
        return this.toResponseDto(user);
  }

  async findOneByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: {
                email: email,
                isActive: true
            },
            relations: ['role'],
            select: {
            idUser: true,
            fullname: true,
            email: true,
            password: true,
            role: {
                idRole: true,
                name: true,
            },
        },
        });

        if (!user) throw new NotFoundException(`User with email "${email}" not found`);
        return this.toAuthResponseDto(user);
    }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
