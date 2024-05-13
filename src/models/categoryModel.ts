import { RowDataPacket } from 'mysql2/promise';
import mariadb from '../db/mariadb';

const getCategories = async () => {
  const getAllCategoriesQuery = `SELECT * FROM categories`;
  const [results] = await mariadb.execute(getAllCategoriesQuery);
  return results;
};

export default { getCategories };
