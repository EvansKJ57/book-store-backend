import { RowDataPacket } from 'mysql2';
import mariadb from '../db/mariadb';

const getCategories = async () => {
  const getAllCategoriesQuery = `SELECT * FROM categories`;
  const [results] = await mariadb.execute<RowDataPacket[]>(getAllCategoriesQuery);
  return results;
};

export default { getCategories };
