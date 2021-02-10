const portBot = process.env.PORTBOT
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});


function _sendStatus(status) {
  io.of('/' + portBot).emit('status', status)
}
module.exports = _sendStatus;
