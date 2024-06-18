import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserDetailResDto } from 'src/dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.getUsers();
    return users.map((user) => new UserDetailResDto(user));
  }
}
