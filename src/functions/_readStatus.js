const _openCon = require('./_openCon');
const _timerStatus = require('./_timerStatus');

var idBot = 0;

var sendStatusTimer = false;

let sendStatus = []

async function _readStatus() {
  try {
      const conn = await _openCon()
      conn.promise().query('SELECT * FROM tbStatus WHERE idBot=' + idBot + ' AND status=0').then(([rows]) => {
          if (rows.length > 0) {
              rows.map((e) => {
                  sendStatus.push({ id: e.id, dateOut: new Date(e.dateOut).getTime() })
                  if (!sendStatusTimer) {
                      _timerStatus()
                  }
              })
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _readStatus;
