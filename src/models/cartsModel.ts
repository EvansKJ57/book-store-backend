import mariadb from '../db/mariadb';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';

const addToCart = async (userId: number, bookId: number, qty: number) => {
  const insertCartQuery = `INSERT INTO carts (user_id, book_id, qty) VALUES (?, ?, ?)`;
  let values = [userId, bookId, qty];
  const [results] = await mariadb.execute<ResultSetHeader>(
    insertCartQuery,
    values
  );
  return results;
};

const getCart = async (userId: number, selectedItems: number[]) => {
  let getCartsQuery = `SELECT 
      carts.id AS cartId, books.id AS bookId, books.title, books.summary, books.price, carts.qty
      FROM carts 
      LEFT JOIN books ON carts.book_id = books.id`;
  const conditions = [`user_id = ?`];
  const values = [userId];

  //주문하기 위해 선택한 카트 아이템을 보여줄 때
  if (selectedItems) {
    conditions.push(` carts.id IN (?)`);
    values.push(...selectedItems);
  }
  // sql문 조건 취합해서 추가하기
  if (conditions) {
    const concat = conditions.join(' AND ');
    getCartsQuery += ` WHERE ${concat}`;
  }

  const [results] = await mariadb.execute(getCartsQuery, values);
  return results;
};

const deleteCart = async (
  cartsId: number[],
  userId: number,
  conn?: PoolConnection
) => {
  const placeHolder = cartsId.map(() => '?').join(', ');
  const deleteCartQuery = `DELETE FROM carts WHERE id IN (${placeHolder}) AND user_id = ?`;
  let values = [...cartsId, userId];
  if (conn) {
    const [results] = await conn.execute<ResultSetHeader>(
      deleteCartQuery,
      values
    );
    return results;
  } else {
    const [results] = await mariadb.execute<ResultSetHeader>(
      deleteCartQuery,
      values
    );
    return results;
  }
};

export default { deleteCart, addToCart, getCart };
