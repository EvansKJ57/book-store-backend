const mariadb = require('../db/mariadb');

const insertData = async (order_id, carts) => {
  let sql = `INSERT INTO order_details (order_id, book_id, qty)
      SELECT "${order_id}", book_id, qty FROM carts
      WHERE carts.id IN (${carts})`;

  const [results] = await mariadb.query(sql);
  return results;
};

module.exports = { insertData };
