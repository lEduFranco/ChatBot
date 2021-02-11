const mysql2 = require('mysql2');

async function _openCon() {
  const conn = mysql2.createPool({
      connectionLimit: 10,
      host: global.dconn.host,
      user: global.dconn.user,
      password: global.dconn.pass,
      database: global.dconn.db,
      multipleStatements: true
  });
  return conn;
}
module.exports = _openCon;
