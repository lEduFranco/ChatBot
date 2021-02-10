const _getChatById = require('./_getChatById');

async function _loadChat(idChat) {
  return new Promise(async (resolve) => {
      try {
          let obj = await _getChatById(idChat)
          let a = obj != undefined ? await obj.fetchMessages({ limit: 150 }) : []
          var file = ''
          for await (let [i, e] of a.entries()) {
              if (e.hasQuotedMsg == true) {
                  a[i]['quoteMsg'] = await e.getQuotedMessage()
                  // file = await _saveMedia(e)
                  // console.log('file', file)
              }
          }
          resolve({ messages: a, unreadCount: obj != undefined ? obj.unreadCount : 0 })
      } catch (error) {
          console.log(error)
          resolve({ messages: 0, unreadCount: 0 })
      }
  })
}
module.exports = _loadChat;
