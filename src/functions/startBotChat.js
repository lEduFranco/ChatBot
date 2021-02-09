import _sendLog from './_sendLog';
import _saveSession from './_saveSession';
import _sendStatus from './_sendStatus';
import _initBot from './_initBot';
import _sendQR from './_sendQR';
import _pmRestart from './_pmRestart';
import _saveContacts from './_saveContacts';
import _sendUnreads from './_sendUnreads';
import _readLists from './_readLists';
import _readStatus from './_readStatus';
import _readMessagesScheduled from './_readMessagesScheduled';
import _notifyAdmin from './_notifyAdmin';
import sendBot from './sendBot';

let config = '';
let sessionData = '';
let client = [];
let initiated = [];
let attendants = [];
var countQr = 0;

var qrMsg = false;
var authenticated = false;
var started = false

const portBot = process.env.PORTBOT
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});


async function startBotChat() {
  if (config.session != null && config.session != '') {
      sessionData = JSON.parse(config.session)
      client = new Client({
          // restartOnAuthFail: true,
          session: sessionData,
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
      })
  } else {
      client = new Client({
          // restartOnAuthFail: true,
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
      })
  }
  _sendLog('O Bot está acordando 🥱...')
  _sendLog('...olá, eu sou o ' + config.nomeBot + ' 🤖 e já estou me configurando para começar...')
  client.initialize();
  client.on('authenticated', (session) => {
      sessionData = session;
      _saveSession(true, session)
      _sendLog('...pronto, estou validado e já salvei meus dados de acesso...')
  });
  client.on('auth_failure', async msg => {
      _sendLog('Opa! Deu falha na autenticação...')
      authenticated = false
      // _saveSession(false, null)
      // sessionData = ''
      _sendStatus('desconectado');
      _initBot()
  });
  client.on('qr', async (qr) => {
      countQr++
      if (countQr <= 5) {
          if (!qrMsg) {
              qrMsg = true
              _sendLog('...leia o QR-CODE por favor...assim eu consigo me conectar :)')
          }
          _sendQR(qr)
          qrcodegen.generate(qr, { small: true });
      } else if (countQr == 6) {
          console.log(new Date(Date.now()).toLocaleTimeString(), ' - Nova tentiva de login em 60 segundos.')
          setTimeout(() => {
              _pmRestart()
          }, 1000 * 60);
      }
  });
  client.on('ready', async (data) => {
      _sendLog('...ótimo, consegui me conectar!...');
      info = client.info
      authenticated = true
      await _saveContacts()
      _sendStatus('conectado')
      await _restartBot()
      if (config.sendUnreads) {
          await _sendUnreads()
      }
      await _readLists()
      await _readStatus()
      await _readMessagesScheduled()

      console.log(new Date(Date.now()).toLocaleTimeString(), ' - Bot ativado')
      _notifyAdmin(new Date(Date.now()).toLocaleTimeString() + ' - Bot ativado')
  });
  client.on('change_state', (state) => {
      console.log(new Date(Date.now()).toLocaleTimeString() + ' - state', state)
  })
  client.on('change_battery', (batteryInfo) => {
      const { battery, plugged } = batteryInfo;
      console.log(`Bateria: ${battery}% - Carregando? ${plugged}`);
  });
  client.on('disconnected', (reason) => {
      console.log(new Date(Date.now()).toLocaleTimeString() + ' - disconnected', reason);
      authenticated = false;
      started = false;
      //_saveSession(false, null); DESATIVADO 28/01/2021
      _sendStatus('desconectado');
      _pmRestart();
  });
  client.on('message', async message => {
      if (message.from == undefined) {
          return false
      }

      await sendBot(message)
      // if (_checkSpammer(message.from)) {

      // }
  })
  client.on('message_ack', async message_ack => {
      let obj = { id: message_ack.id.id, ack: message_ack.ack }
      let idx = initiated.findIndex((e) => e.numero == message_ack.to)
      if (idx != -1) {
          let ea = attendants.filter((e) => e.idAtendente == initiated[idx].idAtend).map((e) => {
              io.of('/' + portBot).to(e.idSocket).emit('message_ack', obj)
          })
          if (ea.length == 0) {
              io.of('/' + portBot).emit('message_ack', obj)
          }
      }
  })
}
export default startBotChat;
