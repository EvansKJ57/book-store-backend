const mariadb = require('../db/mariadb');

const addToCart = async (userId, bookId, qty) => {
  let sql = `INSERT INTO carts (user_id, book_id, qty) 
    VALUES ("${userId}", "${bookId}", "${qty}")`;
  const [results] = await mariadb.query(sql);
  return results;
};

const getCart = async (userId, selectedItems) => {
  let sql = `SELECT 
      carts.id AS cart_id, books.id AS book_id, books.title, books.summary, books.price, carts.qty
      FROM carts 
      LEFT JOIN books ON carts.book_id = books.id`;
  const conditions = [`user_id = "${userId}"`];

  //주문하기 위해 선택한 카트 아이템을 보여줄 때
  if (selectedItems) {
    conditions.push(` carts.id IN (${selectedItems})`);
  }
  // sql문 조건 취합해서 추가하기
  if (conditions) {
    const condition = conditions.join(' AND ');
    sql += ` WHERE ${condition}`;
  }

  const [results] = await mariadb.query(sql);
  return results;
};

const deleteCart = async (cartsId) => {
  let sql = `DELETE FROM carts WHERE id IN (${cartsId})`;
  const [results] = await mariadb.query(sql);
  return results;
};

module.exports = { deleteCart, addToCart, getCart };
