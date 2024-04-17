const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PW;

const mariadb = mysql.createConnection({
  host,
  user,
  password,
  database: 'Bookshop',
  dateStrings: true,
});

module.exports = mariadb.promise();
