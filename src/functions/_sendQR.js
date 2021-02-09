const portBot = process.env.PORTBOT
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});

function _sendQR(qr) {
  io.of('/' + portBot).emit('qr', qr)
}
export default _sendQR;
