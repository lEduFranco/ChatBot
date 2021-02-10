const checkToken = require('../functions/checkToken');

var authenticated = false;
let attendants = [];
let initiated = [];

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
    if (authenticated) {
        var content = req.body;
        var authToken = content.token;
        if (checkToken(authToken)) {
            attendants.filter((e) => e.idAtendente != content.idAtend).map((e) => {
                io.of('/' + portBot).to(e.idSocket).emit('atualizaEntrada', [content.idTicket])
            })
            var b = initiated.findIndex((e) => e.numero == content.idInt)
            if (b != -1) {
                initiated[b]['idAtend'] = content.idAtend
                initiated[b]['idTicket'] = content.idTicket
            }
            res.end('ok');
        } else {
            res.end(JSON.stringify([]))
        }
    }
  }
}
