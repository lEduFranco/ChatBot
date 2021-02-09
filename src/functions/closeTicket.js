import _openCon from './_openCon';
import _sendImg from './_sendImg';
import _timerOcioso from './_timerOcioso';
import _saveMessages from './_saveMessages';

var idBot = 0;
let config = '';
let client = [];
let attendants = [];
let initiated = [];
let cooldowns = [];
var cooldownsRun = false;

const portBot = process.env.PORTBOT
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});


async function closeTicket(data) {
  try {
      const conn = await _openCon();
      await conn.promise().query('UPDATE tbTickets SET idStatus=2, dataFim = NOW() WHERE id=' + data.idTicket + ' AND idBot=' + idBot + ' LIMIT 1').then(async () => {
          // capturing.push({ 'numero': data.idInt, 'etapa': 1, 'nome': initiated[data.idx].nomeCliente })
          let a = attendants.findIndex((e) => e.idAtendente == initiated[data.idx].idAtend)
          if (a != -1) {
              io.of('/' + portBot).to(attendants[a].idSocket).emit('atualizaEntrada', data.idTicket)
          } else {
              io.of('/' + portBot).emit('atualizaEntrada', data.idTicket)
          }
          initiated.splice(data.idx, 1);
          if (config.urlImgInicio.length > 0) {
              await _sendImg(data.idInt, config.msgFinal, config.urlMedia + config.urlImgFim)
          } else {
              await client.sendMessage(data.idInt, config.msgFinal)
          }
          var dTime = cooldowns.findIndex(e => e.idInt == data.idInt);
          if (dTime != -1) {
              cooldowns.splice(cooldowns, 1);
              if (cooldowns.length == 0) {
                  console.log('intervalo pausado')
                  clearInterval(_timerOcioso)
                  cooldownsRun = false
              }
          }
          _saveMessages(data.idInt, data.idTicket)
      }).catch(console.log).then();;
  } catch (error) {
      console.log(error)
  }
}
export default closeTicket;
