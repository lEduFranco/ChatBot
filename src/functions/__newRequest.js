const __spamRequest = require('./__spamRequest');
const _openCon = require('./_openCon');
const __rdCreateDeal = require('./__rdCreateDeal');

const portBot = process.env.PORTBOT;
const app = require('express')();

const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});

async function __newRequest([data]) {
  return new Promise(async (resolve) => {
      try {

          if (!await __spamRequest(data.ip)) {
              const conn = await _openCon()

              var name = data.name
              var phone = data.phone.replace(/\D/g, '')
              var location = data.location
              var ip = data.ip
              conn.promise().query("INSERT INTO tbRequests SET name='" + name + "', phone='" + phone + "', dataIn=NOW(), location='" + location + "', idBot='" + idBot + "', ip='" + ip + "'").then(async ([result]) => {
                  var id = result.insertId
                  data.id = id
                  io.of('/' + portBot).emit('newrequest', data)
                  if (global.config.rdstation.status) {
                      await __rdCreateDeal({ name: name, phone: phone })
                  }
                  resolve(true)
              })
          } else {
              resolve(false)
          }
      } catch (error) {
          resolve(false)
      }
  })
}
module.exports = __newRequest;
