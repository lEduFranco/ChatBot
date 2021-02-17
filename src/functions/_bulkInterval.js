const _openCon = require('./_openCon');
const _timerLists = require('./_timerLists');

const portBot = process.env.PORTBOT

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});

async function _bulkInterval(idList, sch) {
  return new Promise(async (resolve) => {
      try {
          stopTransmission = true
          const conn = await _openCon()
          conn.promise().query('UPDATE tbLists SET status=2 WHERE idBot=' + global.idBot + ' AND id=' + idList + '').then(() => {
              var dList = global.sendList.findIndex(e => e.id == idList);
              if (dList != -1) {
                global.sendList.splice(dList, 1);
              }
              if (sch) {
                global.sendList.push({ id: idList, dateOut: new Date(Date.now()).setMilliseconds(global.config.options.bulkDelay) })
              } else {
                  var date = new Date(Date.now());
                  date.setDate(date.getDate() + 1);
                  date.setHours(global.config.options.schedule[0], 0, 0, 0)
                  global.sendList.push({ id: idList, dateOut: date.getTime() })
              }
              if (!global.sendListTimer) {
                  _timerLists()
              }
              io.of('/' + portBot).emit('sendMessages', { status: 3, time: Date.now() })
              resolve(true)
          }).catch(() => {
              resolve(false)
          })
      } catch (error) {
          resolve(false)
      }
  })
}
module.exports = _bulkInterval;
