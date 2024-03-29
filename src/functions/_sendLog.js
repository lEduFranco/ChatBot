const portBot = process.env.PORTBOT
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});

function _sendLog(msg) {
  io.of('/' + portBot).emit('logs', msg)
  console.log(msg)
}
module.exports = _sendLog;
