const routes = require('./routes/routes');
const app = require('express')();



const portBot = process.env.PORTBOT
var whitelist = ['*'];


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

var authenticated = false;

var qrImg = ''


let attendants = []



let client = [];

let countSendMsg = []

var qrcode = ''





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
        attendants.push({
            'idAtendente': data.idAtendente,
            'idSocket': data.idSocket,
            'setores': data.setores
        })
        io.of('/' + portBot).emit('attendants', attendants)
    });

    socket.on('envia', data => {
        client.sendMessage(data[0], data[1]);
    });

    socket.on('_sendImg', data => {
        _sendImg(data[0], data[1])
    });

    socket.on('disconnect', async () => {
        var dAtendente = attendants.findIndex(e => e.idSocket == socket.id);
        if (dAtendente != -1) {
            attendants.splice(dAtendente, 1);
        }
        io.of('/' + portBot).emit('attendants', attendants)
    });

    socket.on('loadQr', data => {
        if (data == '1') {
            socket.emit('qr', qrImg)
        }
    })

    socket.on('_loadChats', async data => {
        if (authenticated) {
            if (data != null) {
                let chats = await _loadChats(data)
                socket.emit('chats', chats);
            }
        }
    });

    socket.on('_loadChat', async data => {
        if (authenticated) {
            if (data != null) {
                let chat = await _loadChat(data)
                socket.emit('chat', chat);
            }
        }
    });

    socket.on('getStatusBot', data => {
        if (data == '1') {
            var status = authenticated ? 'conectado' : 'desconectado'
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
                    await client.sendMessage(id, msg, { quotedMessageId: idReply }).then((e) => {
                        socket.emit('msgSended', { status: true, hasQuotedMsg: true, id: e.id.id, idBubble: idMsg, serialized: e.id._serialized });
                    })
                } else {
                    await client.sendMessage(id, msg).then((e) => {
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
            socket.emit('countSendMsg', countSendMsg)
        }
    })

    socket.on('sendSeen', async data => {
        try {
            let chat = await client.getChatById(data.idInt)
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
            socket.emit('qr', qrcode)
        }
    })

    socket.on('setUnread', async data => {
        if (data.id != null) {
            await client.markChatUnread(data.id)
        }
    })
});


app.use(routes);
// app.listen(3333);

http.listen(portBot, function () {
    var addr = http.address();
    console.log('Servidor ON em:' + addr.address + ':' + addr.port);
});
