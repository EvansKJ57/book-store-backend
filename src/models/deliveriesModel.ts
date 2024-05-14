import mariadb from '../db/mariadb';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';

const insertData = async (
  {
    address,
    receiver,
    contact,
  }: { address: string; receiver: string; contact: string },
  conn?: PoolConnection
) => {
  const InsertDeliveryQuery = `INSERT INTO deliveries (address, receiver, contact)
        VALUES (?, ?, ?)`;
  let values = [address, receiver, contact];

  if (conn) {
    const [results] = await conn.execute<ResultSetHeader>(
      InsertDeliveryQuery,
      values
    );
    return results;
  } else {
    const [results] = await mariadb.execute<ResultSetHeader>(
      InsertDeliveryQuery,
      values
    );
    return results;
  }
};

export default { insertData };
