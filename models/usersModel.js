const mariadb = require('../db/mariadb');

const createLocal = async (email, name, requestedHashPw, salt) => {
  let sql = `INSERT INTO users (email, name, password, salt, provider) 
    values ( ? , ? , ? , ? , ?) `;

  const values = [email, name, requestedHashPw, salt, 'LOCAL'];
  const [results] = await mariadb.query(sql, values);
  return results;
};

const createOauth = async (
  email,
  name,
  requestedHashPw,
  salt,
  provider,
  provider_id
) => {
  let sql = `INSERT INTO users (email, name, password, salt, provider, provider_user_id) 
    values ( ? , ? , ? , ? , ? , ?) `;
  const values = [email, name, requestedHashPw, salt, provider, provider_id];
  const [results] = await mariadb.query(sql, values);
  return results;
};

const findUserByEmail = async (email) => {
  let sql = `SELECT * FROM users WHERE email = ? `;
  const values = [email];
  const [results] = await mariadb.query(sql, values);
  return results;
};

const updateToken = async (email, token) => {
  let sql = `UPDATE users SET token = ? WHERE email = ?`;
  const values = [token, email];
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

module.exports = {
  createLocal,
  createOauth,
  findUserByEmail,
  updatePw,
  updateToken,
};
