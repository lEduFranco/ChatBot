const _openCon = require('./_openCon');
const _sendList = require('./_sendList');

var idBot = 0;

async function _getList(idList) {
  try {
      const conn = await _openCon()
      conn.promise().query('SELECT tr.idList, tr.data, tr.size, tr.lastSend, tr.lastIndex, tt.body, tt.images FROM tbRecipients tr INNER JOIN tbTemplates tt ON tt.idList=tr.idList WHERE tr.idList=' + idList + ' AND tr.idBot=' + idBot + '').then(([rows]) => {
          if (rows.length == 1) {
              _sendList(rows[0])
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _getList;
