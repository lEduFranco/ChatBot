const _sendLog = require('./_sendLog');
const _saveSession = require('./_saveSession');
const _sendStatus = require('./_sendStatus');
const _initBot = require('./_initBot');
const _sendQR = require('./_sendQR');
const _pmRestart = require('./_pmRestart');
const _saveContacts = require('./_saveContacts');
const _sendUnreads = require('./_sendUnreads');
const _readLists = require('./_readLists');
const _readStatus = require('./_readStatus');
const _readMessagesScheduled = require('./_readMessagesScheduled');
const _notifyAdmin = require('./_notifyAdmin');
const sendBot = require('./sendBot');

const qrcodegen = require('qrcode-terminal');

const portBot = process.env.PORTBOT

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});

// var Client = global.client;

async function startBotChat() {
  if (global.config.session != null && global.config.session != '') {
      global.sessionData = JSON.parse(global.config.session)
      global.client = new Client({
        // restartOnAuthFail: true,
        session: global.sessionData,
        headless: true,
        args: ['--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
        ]
      });
  } else {
      global.client = global.Client
  }
  _sendLog('O Bot está acordando 🥱...')
  _sendLog('...olá, eu sou o ' + global.config.nomeBot + ' 🤖 e já estou me configurando para começar...')
  global.client.initialize();
  global.client.on('authenticated', (session) => {
    global.sessionData = session;
      _saveSession(true, session)
      _sendLog('...pronto, estou validado e já salvei meus dados de acesso...')
  });
  global.client.on('auth_failure', async msg => {
      _sendLog('Opa! Deu falha na autenticação...')
      global.authenticated = false
      // _saveSession(false, null)
      // sessionData = ''
      _sendStatus('desconectado');
      _initBot()
  });
  global.client.on('qr', async (qr) => {
    global.countQr++
      if (global.countQr <= 5) {
          if (!global.qrMsg) {
            global.qrMsg = true
              _sendLog('...leia o QR-CODE por favor...assim eu consigo me conectar :)')
          }
          _sendQR(qr)
          qrcodegen.generate(qr, { small: true });
      } else if (global.countQr == 6) {
          console.log(new Date(Date.now()).toLocaleTimeString(), ' - Nova tentiva de login em 60 segundos.')
          setTimeout(() => {
              _pmRestart()
          }, 1000 * 60);
      }
  });
  global.client.on('ready', async (data) => {
      _sendLog('...ótimo, consegui me conectar!...');
      info = global.client.info
      global.authenticated = true
      await _saveContacts()
      _sendStatus('conectado')
      await _restartBot()
      if (global.config.sendUnreads) {
          await _sendUnreads()
      }
      await _readLists()
      await _readStatus()
      await _readMessagesScheduled()

      console.log(new Date(Date.now()).toLocaleTimeString(), ' - Bot ativado')
      _notifyAdmin(new Date(Date.now()).toLocaleTimeString() + ' - Bot ativado')
  });
  global.client.on('change_state', (state) => {
      console.log(new Date(Date.now()).toLocaleTimeString() + ' - state', state)
  })
  global.client.on('change_battery', (batteryInfo) => {
      const { battery, plugged } = batteryInfo;
      console.log(`Bateria: ${battery}% - Carregando? ${plugged}`);
  });
  global.client.on('disconnected', (reason) => {
      console.log(new Date(Date.now()).toLocaleTimeString() + ' - disconnected', reason);
      global.authenticated = false;
      global.started = false;
      //_saveSession(false, null); DESATIVADO 28/01/2021
      _sendStatus('desconectado');
      _pmRestart();
  });
  global.client.on('message', async message => {
      if (message.from == undefined) {
          return false
      }

      await sendBot(message)
      // if (_checkSpammer(message.from)) {

      // }
  })
  global.client.on('message_ack', async message_ack => {
      let obj = { id: message_ack.id.id, ack: message_ack.ack }
      let idx = global.initiated.findIndex((e) => e.numero == message_ack.to)
      if (idx != -1) {
          let ea = global.attendants.filter((e) => e.idAtendente == initiated[idx].idAtend).map((e) => {
              io.of('/' + portBot).to(e.idSocket).emit('message_ack', obj)
          })
          if (ea.length == 0) {
              io.of('/' + portBot).emit('message_ack', obj)
          }
      }
  })
}
module.exports = startBotChat;
