const _openCon = require('./_openCon');

async function __scheduleMessage(data) {
  return new Promise(async (resolve) => {
      try {
          const conn = await _openCon()
          conn.promise().query("INSERT INTO tbDelivery SET idBot=" + global.idBot + ", message='" + data.message + "', phone='" + data.phone + "', status=0, dateIn=NOW()").then(() => {
              resolve(true)
          })
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
module.exports = __scheduleMessage;
