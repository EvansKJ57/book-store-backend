const mariadb = require('../db/mariadb');

const getCategories = async () => {
  let sql = `SELECT * FROM categories`;
  const [results] = await mariadb.query(sql);
  return results;
};

module.exports = { getCategories };
