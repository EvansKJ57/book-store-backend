import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import mariadb from '../db/mariadb';

const insertData = async (
  order_id: number,
  carts: number[],
  conn: PoolConnection
) => {
  const placeHolder = carts.map(() => '? ').join(', ');
  const insertOrderDetailQuery = `INSERT INTO order_details (order_id, book_id, qty)
      SELECT ? , book_id, qty FROM carts
      WHERE carts.id IN (${placeHolder})`;
  const values = [order_id, ...carts];

  const [results] = await conn.execute<ResultSetHeader>(
    insertOrderDetailQuery,
    values
  );
  return results;
};
export default { insertData };
