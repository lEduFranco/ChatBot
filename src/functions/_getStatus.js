const _openCon = require('./_openCon');
const _newStatus = require('./_newStatus');

var idBot = 0;

async function _getStatus(idStatus) {
  try {
      const conn = await _openCon()
      conn.promise().query('SELECT * FROM tbStatus WHERE id=' + idStatus + ' AND idBot=' + idBot + '').then(([rows]) => {
          if (rows.length == 1) {
              _newStatus(rows[0])
              conn.promise().query('UPDATE tbStatus SET status=1 WHERE id=' + idStatus + ' AND idBot=' + idBot + '')
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _getStatus;
