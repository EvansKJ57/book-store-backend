const mariadb = require('../db/mariadb');

const insertData = async ({ address, receiver, contact }, conn) => {
  const InsertDeliveryQuery = `INSERT INTO deliveries (address, receiver, contact)
        VALUES (?, ?, ?)`;
  let values = [address, receiver, contact];

  if (conn) {
    const [results] = await conn.execute(InsertDeliveryQuery, values);
    return results;
  } else {
    const [results] = await mariadb.execute(InsertDeliveryQuery, values);
    return results;
  }
};

module.exports = { insertData };
