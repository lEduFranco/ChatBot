const mysql2 = require('mysql2');

let dconn = '';

async function _openCon() {
  const conn = mysql2.createPool({
      connectionLimit: 10,
      host: dconn.host,
      user: dconn.user,
      password: dconn.pass,
      database: dconn.db,
      multipleStatements: true
  });
  return conn;
}
module.exports = _openCon;
