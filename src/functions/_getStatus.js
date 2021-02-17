const _openCon = require('./_openCon');
const _newStatus = require('./_newStatus');

async function _getStatus(idStatus) {
  try {
      const conn = await _openCon()
      conn.promise().query('SELECT * FROM tbStatus WHERE id=' + idStatus + ' AND idBot=' + global.idBot + '').then(([rows]) => {
          if (rows.length == 1) {
              _newStatus(rows[0])
              conn.promise().query('UPDATE tbStatus SET status=1 WHERE id=' + idStatus + ' AND idBot=' + global.idBot + '')
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _getStatus;
