import delay from './delay';
import sendBot from './sendBot';

let ms

async function _sendUnreads() {
  try {
      return new Promise(async (resolve, reject) => {
          let _unChats = await client.getChats()
          for await (let e of _unChats) {
              if (e.unreadCount > 0) {
                  console.log(ms);
                  if (typeof ms != "undefined") {
                      var atr = Math.floor(Math.random() * ms.length)
                      await delay(ms[atr])
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
export default _sendUnreads;
