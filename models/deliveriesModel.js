const mariadb = require('../db/mariadb');

const insertData = async ({ address, receiver, contact }, conn) => {
  let sql = `INSERT INTO deliveries (address, receiver, contact)
        VALUES (?, ?, ?)`;
  let values = [address, receiver, contact];

  if (conn) {
    const [results] = await conn.query(sql, values);
    return results;
  } else {
    const [results] = await mariadb.query(sql, values);
    return results;
  }
};

module.exports = { insertData };
