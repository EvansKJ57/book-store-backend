import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'prod';

export default new DataSource({
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
});
