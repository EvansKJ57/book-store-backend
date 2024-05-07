const mariadb = require('../db/mariadb');

const createUser = async (
  email,
  name,
  requestedHashPw,
  salt,
  provider,
  provider_userId
) => {
  const insertUserQuery = `INSERT INTO users (email, name, password, salt, provider, provider_user_id) 
    values ( ? , ? , ? , ? , ? , ?) `;
  const values = [
    email,
    name,
    requestedHashPw,
    salt,
    provider,
    provider_userId,
  ];
  const [results] = await mariadb.execute(insertUserQuery, values);
  return results;
};

const findUserById = async (userId) => {
  const selectUserByIdQuery = `SELECT * FROM users WHERE id = ?`;
  const value = [userId];
  const [results] = await mariadb.execute(selectUserByIdQuery, value);
  return results;
};

const findUserByEmail = async (email) => {
  const selectUserByEmailQuery = `SELECT * FROM users WHERE email = ? `;
  const values = [email];
  const [results] = await mariadb.execute(selectUserByEmailQuery, values);
  return results;
};

const updateToken = async (email, token) => {
  const updateUserTokenQuery = `UPDATE users SET token = ? WHERE email = ?`;
  const values = [token, email];
  const [results] = await mariadb.execute(updateUserTokenQuery, values);
  return results;
};

const updatePw = async (requestedHashPw, salt, email) => {
  const updateUserPwQuery = `UPDATE users 
      SET password =  ? , salt = ? WHERE email = ? `;
  const values = [requestedHashPw, salt, email];
  const [results] = await mariadb.execute(updateUserPwQuery, values);
  return results;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updatePw,
  updateToken,
};
