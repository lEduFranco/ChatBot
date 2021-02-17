const _openCon = require('./_openCon');
const _sendImg = require('./_sendImg');
const _timerOcioso = require('./_timerOcioso');
const _saveMessages = require('./_saveMessages');

const portBot = process.env.PORTBOT
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});


async function closeTicket(data) {
  try {
      const conn = await _openCon();
      await conn.promise().query('UPDATE tbTickets SET idStatus=2, dataFim = NOW() WHERE id=' + data.idTicket + ' AND idBot=' + global.idBot + ' LIMIT 1').then(async () => {
          // capturing.push({ 'numero': data.idInt, 'etapa': 1, 'nome': initiated[data.idx].nomeCliente })
          let a = global.attendants.findIndex((e) => e.idAtendente == global.initiated[data.idx].idAtend)
          if (a != -1) {
              io.of('/' + portBot).to(global.attendants[a].idSocket).emit('atualizaEntrada', data.idTicket)
          } else {
              io.of('/' + portBot).emit('atualizaEntrada', data.idTicket)
          }
          global.initiated.splice(data.idx, 1);
          if (global.config.urlImgInicio.length > 0) {
              await _sendImg(data.idInt, global.config.msgFinal, global.config.urlMedia + global.config.urlImgFim)
          } else {
              await global.client.sendMessage(data.idInt, global.config.msgFinal)
          }
          var dTime = global.cooldowns.findIndex(e => e.idInt == data.idInt);
          if (dTime != -1) {
            global.cooldowns.splice(global.cooldowns, 1);
              if (global.cooldowns.length == 0) {
                  console.log('intervalo pausado')
                  clearInterval(_timerOcioso)
                  global.cooldownsRun = false
              }
          }
          _saveMessages(data.idInt, data.idTicket)
      }).catch(console.log).then();;
  } catch (error) {
      console.log(error)
  }
}
module.exports = closeTicket;
