const mariadb = require('../db/mariadb');

const insertData = async ({ address, receiver, contact }) => {
  let sql = `INSERT INTO deliveries (address, receiver, contact)
        VALUES ("${address}", "${receiver}", "${contact}")`;

  const [results] = await mariadb.query(sql);
  return results;
};

module.exports = { insertData };
