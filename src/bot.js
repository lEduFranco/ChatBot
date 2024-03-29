const routes = require('./routes/routes');

const _getBot = require('./functions/_getBot');
const app = require('express')();
const fs = require('fs');

const BD_CONNECT_BOT = './connection.json';
global.dconn = '';

const portBot = process.env.PORTBOT

global.whitelist = ['*'];

global.urlAudio = global.urlSite + '/media/sended/';

global.apiKey = '';
global.leads = '';
global.sessionData = '';
global.config = '';
global.__timerLists = '';
global.__timerOcioso = '';
global.__timerStatus = '';
global.info = '';
global.urlSite = '';

global.idBot = 0;
global.countQr = 0;

global.authenticated = false;
global.started = false
global.qrMsg = false;
global.sendListTimer = false;
global.sendStatusTimer = false;
global.sendListRun = false;
global.stopTransmission = false;
global.cooldownsRun = false;

global.sectors = []
global.sectors_ = []
global.subsectors = []
global.subsectors_ = []
global.schedules = []
global.answers = []
global.client = [];
global.initiated = [];
global.attendants = [];
global.sendList = [];
global.sendStatus = [];
global.actives = [];
global.countSendMsg = [];
global.cooldowns = [];
global.capturing = [];

global.spammers = {};
global.countClick = { 'sectors': [], 'subsectors': [] }

global.ms

if (fs.existsSync(BD_CONNECT_BOT)) {
  fs.readFile(BD_CONNECT_BOT, async (err, data) => {
      if (err) throw err;
      global.dconn = JSON.parse(data)
      await _getBot()
  })
}

var cors = require('cors');
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            console.log(origin)
            callback(new Error('Not allowed by CORS'))
        }
    }
}))
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    path: '/' + portBot + '/socket.io', cors: {
        origin: '*',
    }
});
//io.set('origins', '');


const bodyParser = require('body-parser')

app.use(bodyParser.json({ limit: '100mb' }));
//let names = require('./names.json');

// var _timerActives = setInterval(() => {
//     actives.map(async(e, i) => {
//         if (e.time < new Date(Date.now())) {
//             var n = e.idInt
//             var idx = initiated.findIndex((e) => e.numero == n)
//             if (idx != -1) {
//                 let obj = { 'idTicket': initiated[idx].idTicket, 'idx': idx, 'idInt': e.idInt }
//                 await closeTicket(obj)
//             }
//             cooldowns.splice(i, 1)
//             if (cooldowns.length == 0) {
//                 clearInterval(_timerOcioso)
//             }
//             var msgOcioso = config.msgOcioso
//             msgOcioso = msgOcioso.replace('%TEMPO%', config.tempoLimite + ' minutos')
//             return await client.sendMessage(n, msgOcioso);
//         }
//     })
// }, 5000);


io.of('/' + portBot).on('connection', async socket => {
    socket.on('cadAtendente', async data => {
        data = JSON.parse(data)
        global.attendants.push({
            'idAtendente': data.idAtendente,
            'idSocket': data.idSocket,
            'setores': data.setores
        })
        io.of('/' + portBot).emit('attendants', global.attendants)
    });

    socket.on('envia', data => {
      global.client.sendMessage(data[0], data[1]);
    });

    socket.on('_sendImg', data => {
        _sendImg(data[0], data[1])
    });

    socket.on('disconnect', async () => {
        var dAtendente = global.attendants.findIndex(e => e.idSocket == socket.id);
        if (dAtendente != -1) {
            global.attendants.splice(dAtendente, 1);
        }
        io.of('/' + portBot).emit('attendants', global.attendants)
    });

    socket.on('loadQr', data => {
        if (data == '1') {
            socket.emit('qr', global.qrImg)
        }
    })

    socket.on('_loadChats', async data => {
        if (global.authenticated) {
            if (data != null) {
                let chats = await _loadChats(data)
                socket.emit('chats', chats);
            }
        }
    });

    socket.on('_loadChat', async data => {
        if (global.authenticated) {
            if (data != null) {
                let chat = await _loadChat(data)
                socket.emit('chat', chat);
            }
        }
    });

    socket.on('getStatusBot', data => {
        if (data == '1') {
            var status = global.authenticated ? 'conectado' : 'desconectado'
            socket.emit('status', status)
            // _sendStatus(status)
        }
    })

    socket.on('enviaSC', async data => {
        try {
            var msg = data.msg
            var id = data.idInt
            var idMsg = data.id
            var idReply = data.idReply
            if (msg != null && id != null) {
                if (idReply != null) {
                    await global.client.sendMessage(id, msg, { quotedMessageId: idReply }).then((e) => {
                        socket.emit('msgSended', { status: true, hasQuotedMsg: true, id: e.id.id, idBubble: idMsg, serialized: e.id._serialized });
                    })
                } else {
                    await global.client.sendMessage(id, msg).then((e) => {
                        socket.emit('msgSended', { status: true, hasQuotedMsg: false, id: e.id.id, idBubble: idMsg, serialized: e.id._serialized });
                    })
                }
                // const horarioAtual = new Date(Date.now());
                // horarioAtual.setSeconds(horarioAtual.getSeconds() + (config.tempoLimite * 60));
                // var lcool = cooldowns.findIndex((e) => e.idInt == data.idInt)
                // if (lcool == -1) {
                //     cooldowns.push({ 'idInt': data.idInt, 'time': horarioAtual });
                // } else {
                //     cooldowns[lcool].time = horarioAtual
                // }
                // if (!cooldownsRun) {
                //     _timerOcioso()
                // }
            }
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('countSends', data => {
        if (data) {
            socket.emit('countSendMsg', global.countSendMsg)
        }
    })

    socket.on('sendSeen', async data => {
        try {
            let chat = await global.client.getChatById(data.idInt)
            await chat.sendSeen()
        } catch (error) { }
    })

    socket.on('getFile', async (data) => {
        data = JSON.parse(data, true)
        // var ext = ''
        // if (data[2] == 'image') {
        //     ext = 'jpg'
        // } else if (data[2] == 'ptt') {
        //     ext = 'ogg'
        // } else if (data[2] == 'document') {
        //     ext = 'pdf'
        // }
        // if (fs.existsSync('./files/' + data[0] + '.' + ext)) {
        //     socket.emit('receiveFile', JSON.stringify({url: urlSite + '/media/files/' + data[0] + '.' + ext, id:data[0], type: data[2], timestamp:Date.now() / 1000}))
        // } else {
        let a = await _loadChat(data[1])

        for await (let b of a.messages) {
            if (b.id.id.trim() == data[0].trim()) {
                let c = await _saveMedia(b)
                socket.emit('receiveFile', JSON.stringify({ url: c.link, id: data[0], type: c.type, ext: c.ext, timestamp: Date.now() / 1000 }))
            }
        }
        // }
    })

    socket.on('getQR', async (data) => {
        if (data == '1') {
            socket.emit('qr', global.qrcode)
        }
    })

    socket.on('setUnread', async data => {
        if (data.id != null) {
            await global.client.markChatUnread(data.id)
        }
    })
});



app.use(routes);

http.listen(portBot, function () {
    var addr = http.address();
    console.log('Servidor ON em:' + addr.address + ':' + addr.port);
});
