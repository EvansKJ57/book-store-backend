const mariadb = require('../db/mariadb');

const insertData = async (order_id, carts, conn) => {
  let sql = `INSERT INTO order_details (order_id, book_id, qty)
      SELECT ? , book_id, qty FROM carts
      WHERE carts.id IN ( ? )`;
  const values = [order_id, carts];
  //transaction 처리시
  if (conn) {
    const [results] = await conn.query(sql, values);
    return results;
  } else {
    const [results] = await mariadb.query(sql, values);
    return results;
  }
};
module.exports = { insertData };
