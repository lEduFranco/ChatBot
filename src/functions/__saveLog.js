import _openCon from './_openCon';

var idBot = 0;

async function __saveLog(idAtend, idAction, data) {
  return new Promise(async (resolve) => {
      try {
          const conn = await _openCon();
          conn.promise().query("INSERT INTO tbLogs SET idBot=" + idBot + ", idAtend=" + idAtend + ", idAction=" + idAction + ", data='" + JSON.stringify(data) + "'").then(([result]) => {
              resolve(true)
          })
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
export default __saveLog;
