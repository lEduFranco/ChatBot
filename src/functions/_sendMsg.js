const getGender = require('./getGender');

let client = [];
let countSendMsg = [];

const portBot = process.env.PORTBOT
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});

async function _sendMsg(number, name, body, image, idImg, idMsg) {
  try {
      return new Promise(async function (resolve, reject) {
          var gender = getGender(name)
          let message = body.replace('%NOME%', name)
          message = message.replace('%AO%', gender == 'male' ? 'o' : 'a')

          if (image != null) {
              const media = MessageMedia.fromFilePath(image);
              await client.sendMessage(number, media, { caption: idImg == 0 ? message : '' }).then((g) => {
                  countSendMsg.push({ status: 1, number: number, name: name, time: Date.now() })
                  io.of('/' + portBot).emit('sendMessages', { status: 1, number: number, name: name, time: Date.now(), index: idMsg })
                  resolve('success')
              }).catch((error) => resolve("error1", error))
          } else {
              await client.sendMessage(number, message).then((g) => {
                  countSendMsg.push({ status: 1, number: number, name: name, time: Date.now() })
                  io.of('/' + portBot).emit('sendMessages', { status: 1, number: number, name: name, time: Date.now(), index: idMsg })
                  resolve('success')
              }).catch((error) => resolve("error2", error))
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _sendMsg;
