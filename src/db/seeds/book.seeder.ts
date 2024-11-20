import { BookModel } from 'src/entities/book.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { fakerKO as faker } from '@faker-js/faker';
import { CategoryModel } from 'src/entities/category.entity';

export default class BookSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(BookModel);
    const categories = await dataSource.getRepository(CategoryModel).find();
    const books = [];
    for (let i = 0; i < 20; i++) {
      books.push({
        title: faker.book.title(),
        author: faker.book.author(),
        isbn: faker.commerce.isbn(),
        form: faker.book.format(),
        img: faker.number.int({ max: 10 }),
        indexList: [],
        detail: faker.lorem.text(),
        category: categories[Math.floor(Math.random() * 5)],
        pages: faker.number.int({ min: 100, max: 300 }),
        price: faker.number.int({ min: 10000, max: 50000 }),
        pubDate: faker.date.anytime(),
        summary: faker.lorem.sentence(),
      });
    }
    await repository.insert(books);
  }
}
