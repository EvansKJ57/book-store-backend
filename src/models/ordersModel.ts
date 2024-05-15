import { ResultSetHeader } from 'mysql2/promise';
import mariadb from '../db/mariadb';
import { PoolConnection } from 'mysql2/promise';
import { IOrderQueryData } from '../types/customTypes';

const insertData = async (
  user_id: number,
  delivery_id: number,
  conn: PoolConnection
) => {
  const insertOrderQuery = `INSERT INTO orders (user_id, delivery_id)
        VALUES ( ? , ? );`;
  const values = [user_id, delivery_id];

  const [results] = await conn.execute<ResultSetHeader>(
    insertOrderQuery,
    values
  );
  return results;
};

const getOrdersByUserId = async (userId: number) => {
  const selectAllOrderInfoQuery = `SELECT
      orders.id, deliveries.address, orders.created_at , deliveries.receiver,books.id AS book_id,
      books.title, books.price, books.author, order_details.qty
      FROM orders
      LEFT JOIN deliveries
      ON orders.delivery_id = deliveries.id
      LEFT JOIN order_details
      ON orders.id = order_details.order_id
      LEFT JOIN books
      ON books.id = order_details.book_id
      WHERE orders.user_id = ? `;

  const values = [userId];
  const [queryData] = await mariadb.execute<IOrderQueryData[]>(
    selectAllOrderInfoQuery,
    values
  );
  return queryData;
};
export default { insertData, getOrdersByUserId };
