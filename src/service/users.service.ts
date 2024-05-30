import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}
  // ----------------
  async getUsers() {
    const users = await this.userRepository.find();
    return users;
  }
  // ----------------

  async createUser(data: Pick<UserModel, 'email' | 'password' | 'nickname'>) {
    const emailExist = await this.userRepository.exists({
      where: { email: data.email },
    });
    if (emailExist) {
      throw new BadRequestException('this email already signed up');
    }
    const nicknameExist = await this.userRepository.exists({
      where: { nickname: data.nickname },
    });

    if (nicknameExist) {
      throw new BadRequestException('this nickname is already used');
    }

    const userObj = this.userRepository.create(data);
    const newUser = this.userRepository.save(userObj);
    return newUser;
  }

  async getUserByEmail(email: string) {
    const foundUser = await this.userRepository.findOneBy({ email });
    return foundUser;
  }
}
