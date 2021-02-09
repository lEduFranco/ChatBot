
const portBot = process.env.PORTBOT
var whitelist = ['*'];


var cors = require('cors');
const app = require('express')();
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

const AWS = require('aws-sdk');
const spacesEndpoint = new AWS.Endpoint('');


let initiated = []
let config = '';


var authenticated = false;

var qrImg = ''
var started = false

let attendants = []
let cooldowns = [];


let client = [];

let countSendMsg = []

var qrcode = ''
var urlSite = ''

var urlAudio = urlSite + '/media/sended/'



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


app.post('/' + portBot + '/finalizaticket', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (authenticated) {
                initiated.filter((a) => a.numero == content.idInt).forEach((b) => {
                    initiated.splice(initiated.indexOf(b), 1)
                })
                if (config.urlImgFim.length > 0 && config.urlImgFim != '') {
                    if (config.chatbot) {
                        await _sendImg(content.idInt, config.msgFinal, config.urlMedia + config.urlImgFim)
                    }
                } else {
                    if (config.chatbot) {
                        await client.sendMessage(content.idInt, config.msgFinal)
                    }
                }
                var dTime = cooldowns.findIndex(e => e.idInt == content.idInt);
                if (dTime != -1) {
                    cooldowns.splice(cooldowns, 1);
                    if (cooldowns.length == 0) {
                        console.log('intervalo pausado')
                        clearInterval(_timerOcioso)
                        cooldownsRun = false
                    }
                }
                res.status(201).json({ status: true });
                await _saveMessages(content.idInt, content.idTicket)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/sendaudio', async function (req, res) {
    try {
        var content = req.body;
        content.url = urlAudio + content.url
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (authenticated) {
                var content = req.body;
                res.end(content.url);
                await _sendAudio(content)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/sendfile', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (authenticated) {
                var content = req.body;
                let a = await _sendFile(content.idChat, urlAudio + content.url)
                res.status(201).json(a)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/newticket', async function (req, res) {
    if (authenticated) {
        var content = req.body;
        var authToken = content.token;
        if (checkToken(authToken)) {
            var img = await client.getProfilePicUrl(content.idInt)
            var phone = content.idInt.split('@')[0]
            var idx = initiated.findIndex((e) => e.numero == content.idInt)
            if (idx == -1) {
                initiated.push({ 'nomeCliente': content.nomeCliente, 'numero': content.idInt, 'etapa': 2, 'tipo': 'atendhumano' })
            } else {
                initiated[idx].etapa = 2
                initiated[idx].tipo = 'atendHumano'
            }
            var idx = initiated.findIndex((e) => e.numero == content.idInt)
            let obj = {
                'id': idx,
                'nomeCliente': content.nomeCliente,
                'telefoneCliente': phone,
                'idSetor': '0',
                'idSubSetor': '0',
                'imgCliente': img,
                'idInt': content.idInt,
                'idAtend': content.idAtend
            }
            res.end('sucesso');
            await _newTicket(obj)
        } else {
            res.end(JSON.stringify([]))
        }
    } else {
        res.sendStatus(404)
    }
});

app.post('/' + portBot + '/userchat', async function (req, res) {
    if (authenticated) {
        var content = req.body;
        var authToken = content.token;
        if (checkToken(authToken)) {
            let a = await _loadChats(content)
            res.end(JSON.stringify(a));
        } else {
            res.end(JSON.stringify([]))
        }
    }
});

app.post('/' + portBot + '/logout', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (started && authenticated) {
                res.end('ok')
                _sendStatus('desconectado');
                await changeState(false).then(async (e) => {
                    if (e) {
                        await _saveStatistics().then((e) => {
                            if (e) {
                                _pmRestart()
                            }
                        })
                    }
                })
            } else {
                res.sendStatus(404)
            }
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/resetbot', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (started && authenticated) {
                res.end('ok')
                _sendStatus('desconectado');
                await changeState(false).then(async (e) => {
                    if (e) {
                        await _saveStatistics().then(async (e) => {
                            if (e) {
                                if (await _saveSession(false, null)) {
                                    await client.logout()
                                    _pmRestart()
                                }

                            }
                        })
                    }
                })
            } else {
                res.sendStatus(404)
            }
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/newlist', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let response = await __newList(content).then((response) => {
                if (response.status) {
                    res.status(201).json(response)
                } else {
                    res.status(400).json(response)
                }
            })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/newstatus', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let response = await __newStatus(content).then((response) => {
                if (response.status) {
                    res.status(201).json(response)
                } else {
                    res.status(400).json(response)
                }
            })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/logged', async function (req, res) {
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
});

app.post('/' + portBot + '/transferchat', async function (req, res) {
    try {

        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await __transferChat(content)
            res.status(201).json({ status: a ? 'success' : 'error' })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/getuserid', async function (req, res) {
    try {


        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await __getUserData({ idInt: content.id })
            res.status(201).json({ data: a })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/blockuser', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await client.getContactById(content.id)
            let b = await a.block(a).then()
            res.status(201).json({ status: b })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/unblockuser', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await client.getContactById(content.id)
            let b = await a.unblock(a).then()
            res.status(201).json({ status: b })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/getuserpic', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await client.getProfilePicUrl(content.id)
            let b = await __refreshPicUser({ idInt: content.id, url: a })
            res.status(201).json({ data: a })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/newchat', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await __newchat(content)
            res.status(201).json(a)
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/newrequest', async function (req, res) {
    try {
        var content = req.body;
        content[0].ip = req.headers['x-real-ip']
        let a = await __newRequest(content)
        if (a) {
            res.status(201).json(a)
        } else {
            res.status(404).end('404 Not found')
        }
    } catch (error) {
        console.log(error)
    }
});

app.post('/' + portBot + '/send', async function (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            await __sendMessage(content).then((response) => {
                if (response.status) {
                    res.status(201).json(response)
                } else {
                    res.status(400).json(response)
                }
            })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
});

http.listen(portBot, function () {
    var addr = http.address();
    console.log('Servidor ON em:' + addr.address + ':' + addr.port);
});
