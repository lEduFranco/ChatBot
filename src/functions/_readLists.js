const _openCon = require('./_openCon');
const _timerLists = require('./_timerLists');

let sendList = [];
var idBot = 0;

var sendListTimer = false;

async function _readLists() {
  try {
      const conn = await _openCon()
      conn.promise().query('SELECT * FROM tbLists WHERE idBot=' + idBot + ' AND status IN (0, 2)').then(([rows]) => {
          if (rows.length > 0) {
              rows.map((e) => {
                  sendList.push({ id: e.id, dateOut: new Date(e.dateOut).getTime() })
                  if (!sendListTimer) {
                      _timerLists()
                  }
              })
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _readLists;
