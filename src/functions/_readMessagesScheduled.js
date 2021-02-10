const _openCon = require('./_openCon');
const __checkAllowMessage = require('./__checkAllowMessage');
const delay = require('./delay');

var idBot = 0;

let client = [];
let ms


async function _readMessagesScheduled() {
  return new Promise(async (resolve) => {
      try {
          const conn = await _openCon()
          conn.promise().query('SELECT * FROM tbDelivery WHERE idBot=' + idBot + ' AND status=0').then(async ([rows]) => {
              if (rows.length > 0) {
                  let a = []
                  for await (let e of rows) {
                      if (__checkAllowMessage(e.phone)) {
                          await client.sendMessage(e.phone, e.message).then(() => {
                              a.push(e.id)
                          })
                          await delay(ms[Math.floor(Math.random() * ms.length)])
                      } else {
                          a.push(e.id)
                      }
                  }
                  conn.promise().query('UPDATE tbDelivery SET status=1, dateOut=NOW() WHERE id IN (' + a + ') AND idBot = ' + idBot + '').then(() => {
                      resolve(true)
                  })
              }
              else {
                  resolve(true)
              }
          })
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
module.exports = _readMessagesScheduled;
