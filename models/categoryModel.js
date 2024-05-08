const mariadb = require('../db/mariadb');

const getCategories = async () => {
  const getAllCategoriesQuery = `SELECT * FROM categories`;
  const [results] = await mariadb.execute(getAllCategoriesQuery);
  return results;
};

module.exports = { getCategories };
