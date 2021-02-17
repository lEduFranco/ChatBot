const _openCon = require('./_openCon');

async function _saveMessages(idChat, idTicket) {
  try {
      const conn = await _openCon();
      let _messages = await _loadChat(idChat)
      let obj = []
      const promises = _messages.messages.map(async (e, i) => {
          var msg = e.body
          var timestamp = e.timestamp
          var fromMe = e.fromMe
          obj.push({ 'msg': msg, 'timestamp': timestamp, 'fromMe': fromMe, 'id': e.id.id, 'type': e.type, 'hasMedia': e.hasMedia })
      })
      await Promise.all(promises)
      obj = JSON.stringify(obj)
      await conn.promise().query('INSERT INTO tbTicketsMsg (idTicket, messages, dataCad, idBot) VALUES (' + idTicket + ', ' + conn.escape(obj) + ', NOW(), ' + global.idBot + ')').catch(console.log)
  } catch (error) {
      console.log(error)
  }
}
module.exports = _saveMessages;
