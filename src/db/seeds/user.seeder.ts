import { UserModel } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { fakerKO as faker } from '@faker-js/faker';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserModel);
    const users = [];
    for (let i = 0; i < 5; i++) {
      users.push({
        email: faker.internet.email(),
        password: '123123',
        nickname: faker.internet.username(),
        provider: 'LOCAL',
      });
    }
    await repository.insert(users);
  }
}
