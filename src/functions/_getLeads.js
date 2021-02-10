const _openCon = require('./_openCon');

var idBot = 0;
let leads = ''

async function _getLeads() {
  return new Promise(async (resolve) => {
      try {
          const conn = await _openCon();
          await conn.promise().query('SELECT id, idInt, nomeCliente, statusCliente, acTransmissao FROM tbLeads WHERE idBot=' + idBot + '').then(([rows, fields]) => {
              leads = rows
              resolve(true)
          })
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
module.exports = _getLeads;
