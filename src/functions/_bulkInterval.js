import _openCon from './_openCon';
import _timerLists from './_timerLists';

const portBot = process.env.PORTBOT

var idBot = 0;
var sendListTimer = false;

let config = '';
let sendList = []

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
          conn.promise().query('UPDATE tbLists SET status=2 WHERE idBot=' + idBot + ' AND id=' + idList + '').then(() => {
              var dList = sendList.findIndex(e => e.id == idList);
              if (dList != -1) {
                  sendList.splice(dList, 1);
              }
              if (sch) {
                  sendList.push({ id: idList, dateOut: new Date(Date.now()).setMilliseconds(config.options.bulkDelay) })
              } else {
                  var date = new Date(Date.now());
                  date.setDate(date.getDate() + 1);
                  date.setHours(config.options.schedule[0], 0, 0, 0)
                  sendList.push({ id: idList, dateOut: date.getTime() })
              }
              if (!sendListTimer) {
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
export default _bulkInterval;
