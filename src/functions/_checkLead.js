const _openCon = require('./_openCon');

async function _checkLead(idInt) {
  try {
      return new Promise(async (resolve) => {
          const conn = await _openCon();
          var tel = idInt.substr(-8)
          conn.promise().query("SELECT * FROM tbLeads WHERE idInt LIKE '%" + idInt + "%' AND idBot=" + global.idBot + "").then(([rows, fields]) => {
              if (rows.length > 0) {
                  resolve(true)
              } else {
                  resolve(false)
              }
          })
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _checkLead;
