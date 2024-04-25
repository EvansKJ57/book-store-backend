const mariadb = require('../db/mariadb');

const create = async (email, name, requestedHashPw, salt) => {
  let sql = `INSERT INTO users (email, name, password, salt) 
    values ( ? , ? , ? , ? ) `;

  const values = [email, name, requestedHashPw, salt];
  const [results] = await mariadb.query(sql, values);
  return results;
};

const findUserByEmail = async (email) => {
  let sql = `SELECT * FROM users WHERE email = ? `;
  const values = [email];
  const [results] = await mariadb.query(sql, values);
  return results;
};

const updatePw = async (requestedHashPw, salt, email) => {
  let sql = `UPDATE users 
      SET password =  ? , salt = ? WHERE email = ? `;
  const values = [requestedHashPw, salt, email];
  const [results] = await mariadb.query(sql, values);
  console.log(results);
  return results;
};

module.exports = { create, findUserByEmail, updatePw };
