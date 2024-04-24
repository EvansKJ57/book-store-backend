const mariadb = require('../db/mariadb');

const addToCart = async (userId, bookId, qty) => {
  let sql = `INSERT INTO carts (user_id, book_id, qty) VALUES (?, ?, ?)`;
  let values = [userId, bookId, qty];
  const [results] = await mariadb.query(sql, values);
  return results;
};

const getCart = async (userId, selectedItems) => {
  let sql = `SELECT 
      carts.id AS cartId, books.id AS bookId, books.title, books.summary, books.price, carts.qty
      FROM carts 
      LEFT JOIN books ON carts.book_id = books.id`;
  const conditions = [`user_id = ?`];
  const values = [userId];

  //주문하기 위해 선택한 카트 아이템을 보여줄 때
  if (selectedItems) {
    conditions.push(` carts.id IN (?)`);
    values.push(selectedItems);
  }
  // sql문 조건 취합해서 추가하기
  if (conditions) {
    const concat = conditions.join(' AND ');
    sql += ` WHERE ${concat}`;
  }

  const [results] = await mariadb.query(sql, values);
  return results;
};

const deleteCart = async (cartsId, userId, conn) => {
  let sql = `DELETE FROM carts WHERE id IN ( ? ) AND user_id = ?`;
  let values = [cartsId, userId];
  if (conn) {
    const [results] = await conn.query(sql, values);
    return results;
  } else {
    const [results] = await mariadb.query(sql, values);
    return results;
  }
};

module.exports = { deleteCart, addToCart, getCart };
