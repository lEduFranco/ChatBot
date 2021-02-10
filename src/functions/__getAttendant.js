const _openCon = require ('./_openCon');

var idBot = 0;

async function __getAttendant(id) {
  try {
      return new Promise(async (resolve) => {
          const conn = await _openCon()
          conn.promise().query("SELECT nomeAtend FROM tbAttendants WHERE id='" + id + "' AND idBot=" + idBot + "").then(([rows]) => {
              if (rows.length > 0) {
                  resolve(rows[0].nomeAtend)
              } else {
                  resolve(null)
              }
          }).catch(console.log)
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = __getAttendant;
