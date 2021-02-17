const _openCon = require('./_openCon');

async function _getLeads() {
  return new Promise(async (resolve) => {
      try {
          const conn = await _openCon();
          await conn.promise().query('SELECT id, idInt, nomeCliente, statusCliente, acTransmissao FROM tbLeads WHERE idBot=' + global.idBot + '').then(([rows, fields]) => {
            global.leads = rows
              resolve(true)
          })
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
module.exports = _getLeads;
