import _checkApiKey from '../functions/_checkApiKey';
import _loadChats from '../functions/_loadChats';

const portBot = process.env.PORTBOT;

const http = require('http').Server(app)
const io = require('socket.io')(http, {
    path: '/' + portBot + '/socket.io', cors: {
        origin: '*',
    }
});

export default class LoggedController {
  async create (req, res) {
    try {

        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            io.of('/' + portBot).emit('userLogged', { user: content.name })
            res.status(201).json({ user: content.name })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
  }
}