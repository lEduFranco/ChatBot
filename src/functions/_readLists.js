const _openCon = require('./_openCon');
const _timerLists = require('./_timerLists');

async function _readLists() {
  try {
      const conn = await _openCon()
      conn.promise().query('SELECT * FROM tbLists WHERE idBot=' + global.idBot + ' AND status IN (0, 2)').then(([rows]) => {
          if (rows.length > 0) {
              rows.map((e) => {
                global.sendList.push({ id: e.id, dateOut: new Date(e.dateOut).getTime() })
                  if (!global.sendListTimer) {
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
