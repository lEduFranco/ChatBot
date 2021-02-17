const checkToken = require('../functions/checkToken');

const portBot = process.env.PORTBOT
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});


module.exports = {
 async create(req, res) {
    if (global.authenticated) {
        var content = req.body;
        var authToken = content.token;
        if (checkToken(authToken)) {
          global.attendants.filter((e) => e.idAtendente != content.idAtend).map((e) => {
                io.of('/' + portBot).to(e.idSocket).emit('atualizaEntrada', [content.idTicket])
            })
            var b = global.initiated.findIndex((e) => e.numero == content.idInt)
            if (b != -1) {
                global.initiated[b]['idAtend'] = content.idAtend
                global.initiated[b]['idTicket'] = content.idTicket
            }
            res.end('ok');
        } else {
            res.end(JSON.stringify([]))
        }
    }
  }
}
