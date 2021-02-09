import _openCon from './_openCon';

var idBot = 0;

async function __scheduleMessage(data) {
  return new Promise(async (resolve) => {
      try {
          const conn = await _openCon()
          conn.promise().query("INSERT INTO tbDelivery SET idBot=" + idBot + ", message='" + data.message + "', phone='" + data.phone + "', status=0, dateIn=NOW()").then(() => {
              resolve(true)
          })
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
export default __scheduleMessage;
