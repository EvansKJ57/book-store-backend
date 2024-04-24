const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PW;

const mariadb = mysql.createPool({
  host,
  user,
  password,
  database: 'Bookshop',
  dateStrings: true,
  connectionLimit: 10,
  waitForConnections: true, // 커넥션을 다 사용하면 큐에 넣고 기다리게 할지 여부 정하는 옵션
});

module.exports = mariadb.promise();
