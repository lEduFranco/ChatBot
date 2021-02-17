const _openCon = require('./_openCon');

async function _saveSession(status, data) {
  return new Promise(async resolve => {
      try {
          const conn = await _openCon();
          if (status) {
              await conn.promise().query('UPDATE tbConfigBot SET session=' + conn.escape(JSON.stringify(data)) + ' WHERE idBot=' + global.idBot + ' LIMIT 1').then(() => {
                  resolve(true)
              })
          } else {
              await conn.promise().query('UPDATE tbConfigBot SET session="", state=0 WHERE idBot=' + global.idBot + ' LIMIT 1').catch(console.log).then(() => {
                  resolve(true)
              });
          }
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
module.exports = _saveSession;
