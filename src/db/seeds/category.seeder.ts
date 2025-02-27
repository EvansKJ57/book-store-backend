import { CategoryModel } from 'src/entities/category.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(CategoryModel);
    await repository.insert([
      { name: '동화' },
      { name: '소설' },
      { name: '에세이' },
      { name: '시' },
      { name: '잡지' },
    ]);
  }
}
