import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { IDelivery } from '../types/customTypes';

const insertData = async (
  { address, receiver, contact }: IDelivery,
  conn: PoolConnection
) => {
  const InsertDeliveryQuery = `INSERT INTO deliveries (address, receiver, contact)
        VALUES (?, ?, ?)`;
  let values = [address, receiver, contact];

  const [results] = await conn.execute<ResultSetHeader>(
    InsertDeliveryQuery,
    values
  );
  return results;
};

export default { insertData };
