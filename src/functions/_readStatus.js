const _openCon = require('./_openCon');
const _timerStatus = require('./_timerStatus');

async function _readStatus() {
  try {
      const conn = await _openCon()
      conn.promise().query('SELECT * FROM tbStatus WHERE idBot=' + global.idBot + ' AND status=0').then(([rows]) => {
          if (rows.length > 0) {
              rows.map((e) => {
                global.sendStatus.push({ id: e.id, dateOut: new Date(e.dateOut).getTime() })
                  if (!global.sendStatusTimer) {
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
