const mariadb = require('../db/mariadb');

const insertData = async (order_id, carts, conn) => {
  const placeHolder = carts.map(() => '? ').join(', ');
  const insertOrderDetailQuery = `INSERT INTO order_details (order_id, book_id, qty)
      SELECT ? , book_id, qty FROM carts
      WHERE carts.id IN (${placeHolder})`;
  const values = [order_id, ...carts];
  //transaction 처리시
  if (conn) {
    const [results] = await conn.execute(insertOrderDetailQuery, values);
    return results;
  } else {
    const [results] = await mariadb.execute(insertOrderDetailQuery, values);
    return results;
  }
};
module.exports = { insertData };
