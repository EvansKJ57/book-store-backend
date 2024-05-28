import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersModel } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,
  ) {}

  async createUser(data: CreateUserDto) {
    const emailExist = await this.userRepository.exists({
      where: { email: data.email },
    });
    if (emailExist) {
      throw new BadRequestException('this email already signed up');
    }
    const hash = await bcrypt.hash(
      data.password,
      Number(process.env.HASH_ROUND),
    );

    const userObj = await this.userRepository.create({
      ...data,
      password: hash,
    });
    const createUser = this.userRepository.save(userObj);
    return createUser;
  }
}
