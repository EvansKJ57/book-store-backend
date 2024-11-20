import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import CategorySeeder from './seeds/category.seeder';
import BookSeeder from './seeds/book.seeder';
import UserSeeder from './seeds/user.seeder';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'prod';

const databaseOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    isProduction ? 'dist/entities/*.entity.js' : 'src/entities/*.entity.ts',
  ],
  migrations: [
    isProduction ? 'dist/db/migrations/**/*.js' : 'src/db/migrations/**/*.ts',
  ],
  migrationsTableName: 'migration',
  // seeds: ['src/db/seeds/**/*.seeder.ts'], seeder가 순서대로 적용하기 위해서 따로 명시해줌
  seeds: [CategorySeeder, UserSeeder, BookSeeder],
};

export default new DataSource(databaseOptions);
