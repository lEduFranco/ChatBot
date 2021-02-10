const _openCon = require('./_openCon');
const __saveLog = require('./__saveLog');
const _loadChat = require('./_loadChat');

const portBot = process.env.PORTBOT

let client = [];
let initiated = [];
let attendants = [];

const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});

async function __transferChat(data) {
  try {
      return new Promise(async (resolve) => {
          const conn = await _openCon()
          var a = initiated.findIndex((e) => e.idTicket == data.id)
          if (a != -1) {
              conn.promise().query("SELECT id FROM tbTickets WHERE id=" + data.id + " AND idAtend=" + initiated[a]['idAtend'] + " AND idBot=" + idBot + "").then(async ([rows]) => {
                  if (rows.length > 0) {
                      conn.promise().query("UPDATE tbTickets SET idAtend='" + data.to + "', idSetor=" + data.sec + " WHERE id=" + data.id + " AND idAtend=" + initiated[a]['idAtend'] + " AND idBot=" + idBot + " LIMIT 1").then(async () => {
                          if (await __saveLog(initiated[a]['idAtend'], 3, data)) {
                              initiated[a]['idAtend'] = data.to
                              initiated[a]['idSetor'] = data.sec
                              let obj = []
                              let msg = await _loadChat(initiated[a]['numero'])
                              obj.push({
                                  'chat': {
                                      'id': data.id,
                                      'idAtend': data.to,
                                      'idInt': initiated[a]['numero'],
                                      'nomeCliente': initiated[a]['nomeCliente'],
                                      'imgCliente': await client.getProfilePicUrl(initiated[a]['numero'])
                                  },
                                  'mensagens': msg.messages
                              })
                              let ea = attendants.filter((e) => e.idAtendente == data.to).map((e) => {
                                  io.of('/' + portBot).to(e.idSocket).emit('transferChat', JSON.stringify(obj))
                              })
                              resolve(true)
                          } else {
                              resolve(false)
                          }
                      }).catch(console.log)
                  }
              }).catch(console.log)
          } else {
              resolve(false)
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = __transferChat;
