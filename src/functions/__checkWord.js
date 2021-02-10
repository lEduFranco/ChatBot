const sendBot = require ('./sendBot');

async function __checkWord(word) {
  return new Promise(async (resolve) => {
      try {
          console.log('verificando')
          let a = await client.getChats()
          a.splice(1001, a.length - 1)
          console.log(`chats: `, a.length)
          var count = 0
          let g = []
          for await (let b of a) {

              if (b.unreadCount == 0) {
                  let c = await b.fetchMessages({ limit: 2 })
                  if (c[0].fromMe) {
                      if (c[0].body == word) {
                          count++
                          g.push(c[0].from)
                          if (await sendBot(c[0])) {
                              console.log(`enviou`)
                          } else {
                              console.log(`nao enviou`)
                          }
                          console.log(count)
                      }
                  }

              }
          }
          console.log(`array`, g)
          resolve(true)
      } catch (error) {
          resolve(false)
          console.log(error)
      }
  })
}
module.exports = __checkWord;
