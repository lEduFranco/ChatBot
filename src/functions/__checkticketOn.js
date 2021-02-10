const _openCon = require ('./_openCon');

var idBot = 0;

async function __checkticketOn(id) {
  return new Promise(async (resolve) => {
      const conn = await _openCon()
      conn.promise().query("SELECT id FROM tbTickets WHERE idBot=" + idBot + " AND idLead=" + id + " AND idStatus IN (0,1)").then(([rows]) => {
          if (rows.length > 0) {
              resolve(true)
          } else {
              resolve(false)
          }
      })
  })
}
module.exports = __checkticketOn;
