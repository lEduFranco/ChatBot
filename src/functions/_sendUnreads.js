const delay = require('./delay');
const sendBot = require('./sendBot');

async function _sendUnreads() {
  try {
      return new Promise(async (resolve, reject) => {
          let _unChats = await client.getChats()
          for await (let e of _unChats) {
              if (e.unreadCount > 0) {
                  console.log(global.ms);
                  if (typeof global.ms != "undefined") {
                      var atr = Math.floor(Math.random() *global. ms.length)
                      await delay(global.ms[atr])
                      let b = await e.fetchMessages({ limit: 1 })
                      await sendBot(b[0])
                  }
              }
          }
          resolve('success')
      })
  } catch (error) {
      console.log(error)
      reject('error')
  }
}
module.exports = _sendUnreads;
