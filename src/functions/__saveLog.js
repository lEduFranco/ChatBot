const _openCon = require('./_openCon');

async function __saveLog(idAtend, idAction, data) {
  return new Promise(async (resolve) => {
      try {
          const conn = await _openCon();
          conn.promise().query("INSERT INTO tbLogs SET idBot=" + global.idBot + ", idAtend=" + idAtend + ", idAction=" + idAction + ", data='" + JSON.stringify(data) + "'").then(([result]) => {
              resolve(true)
          })
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
module.exports = __saveLog;
