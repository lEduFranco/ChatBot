import _openCon from './_openCon';

var idBot = 0;

async function _checkLead(idInt) {
  try {
      return new Promise(async (resolve) => {
          const conn = await _openCon();
          var tel = idInt.substr(-8)
          conn.promise().query("SELECT * FROM tbLeads WHERE idInt LIKE '%" + idInt + "%' AND idBot=" + idBot + "").then(([rows, fields]) => {
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
export default _checkLead;
