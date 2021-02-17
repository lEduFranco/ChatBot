const _openCon = require('./_openCon');

async function checkToken(token) {
  try {
      if (token != null && token != '') {
          const conn = await _openCon();
          var c = false
          const a = await conn.promise().query('SELECT * FROM tbAttendants WHERE md5(authToken)="' + token + '" AND idBot=' + global.idBot + '').then(([rows, fields]) => {
              if (rows.length == 1) {
                  c = true
              } else {
                  c = false
              }
          }).catch(console.log)
          return c
      } else {

          return false
      }
  } catch (error) {
      console.log(error)
  }
}
module.exports = checkToken;
