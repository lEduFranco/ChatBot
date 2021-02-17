const _openCon = require('./_openCon');

async function _getContactsSaved() {
  try {
      const conn = await _openCon();
      let obj = []
      await conn.promise().query('SELECT idInt FROM tbLeads WHERE idBot=' + global.idBot + '').then(([rows, fields]) => {
          obj = rows
      }).catch(console.log).then();;
      return obj;
  } catch (error) {
      console.log(error)
  }
}
module.exports = _getContactsSaved;
