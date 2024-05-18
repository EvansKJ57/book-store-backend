import mariadb from '../db/mariadb';
import { ICategoryQueryData } from '../types/customTypes';

const CategoryModel = {
  getCategories: async () => {
    const getAllCategoriesQuery = `SELECT * FROM categories`;
    const [results] = await mariadb.execute<ICategoryQueryData[]>(
      getAllCategoriesQuery
    );
    return results;
  },
};
export default CategoryModel;
