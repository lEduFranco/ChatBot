const _getImagesList = require('./_getImagesList');
const _checkScheduleMessage = require('./_checkScheduleMessage');
const _openCon = require('./_openCon');
const _sendMsg = require('./_sendMsg');
const _bulkInterval = require('./_bulkInterval');
const delay = require('./delay');

async function _sendList(data) {
  try {

    global.sendListRun = true
      console.log(new Date(Date.now()).toLocaleTimeString(), ' - inicio de disparo da lista ID: ' + data.idList)
      var idList = data.idList
      let recipients = JSON.parse(data.data)
      var last = data.lastSend
      if (last != '' && last != null) {
          let idLast = recipients.findIndex((e) => e.phone == last)
          if (idLast != -1) {
              idLast++
              recipients = recipients.splice(idLast, recipients.length)
          }
      }

      var body = data.body
      if (global.config.leaveList && global.config.msgLeaveList != '') {
          body += `\n\n${global.config.msgLeaveList}`
      }

      let url_d = await _getImagesList(JSON.parse(data.images))
      var count = 0;
      var count_bulk = 0
      var checksch = _checkScheduleMessage()

      /*
      async function send(a, i) {
          if (typeof a != "undefined") {
              if (!stopTransmission) {
                  const conn = await _openCon()
                  conn.promise().query('UPDATE tbRecipients SET lastSend="' + a.phone + '", lastIndex="' + count + '", lastTime=NOW() WHERE idBot=' + idBot + ' AND id=' + idList + '').catch(console.log).then();
                  count_bulk++
                  count++

                  //var b = Math.floor(Math.random() * ms.length)
                  var b = Math.floor(Math.random() * (parseInt(ms[1]) - parseInt(ms[0]) + 1)) + parseInt(ms[0]);
                  var b = 10;

                  //await delay(b);

                  console.log("DELAY: ", b);

                  if (url_d.length > 0) {
                      for (let index = 0; index < url_d.length; index++) {
                          let g = url_d[index];
                          await _sendMsg(a.phone + '@c.us', a.name, body, g.url, index, count)
                      }
                  } else {
                      await _sendMsg(a.phone + '@c.us', a.name, body, null, null)
                  }

                  console.log("####", count_bulk, "==", config.options.bulkLength, "||", checksch);
                  if (count_bulk == config.options.bulkLength || !checksch) {
                      console.log("PARA DE ENVIAR!");
                      await _bulkInterval(idList, checksch)
                      count_bulk = 0
                  }

                  console.log("stopTransmission", stopTransmission);
                  //const conn = await _openCon()
                  conn.promise().query('UPDATE tbLists SET status=1 WHERE idBot=' + idBot + ' AND id=' + idList + '').catch(console.log).then();

                  console.log("envia!", i, "##", i + 1);

                  setTimeout(function () {
                      send(recipients[i + 1], i + 1);
                  }, b * 1000);
              }
          }
      }

      send(recipients[0], 0);
      */

      const conn = await _openCon()

      for await (let a of recipients) {
          if (!global.stopTransmission) {
              conn.promise().query('UPDATE tbRecipients SET lastSend="' + a.phone + '", lastIndex="' + count + '", lastTime=NOW() WHERE idBot=' + global.idBot + ' AND id=' + idList + '').catch(console.log).then();
              count_bulk++
              count++

              //var b = Math.floor(Math.random() * ms.length)
              var b = Math.floor(Math.random() * (parseInt(ms[1]) - parseInt(ms[0]) + 1)) + parseInt(ms[0]);
              //var b = 10;

              console.log("DELAY: ", b);

              if (url_d.length > 0) {
                  for (let index = 0; index < url_d.length; index++) {
                      let g = url_d[index];
                      await _sendMsg(a.phone + '@c.us', a.name, body, g.url, index, count)
                  }
              } else {
                  await _sendMsg(a.phone + '@c.us', a.name, body, null, null)
              }

              console.log("####", count_bulk, "==", global.config.options.bulkLength, "||", checksch);
              if (count_bulk == global.config.options.bulkLength || !checksch) {
                  console.log("PARA DE ENVIAR!");
                  await _bulkInterval(idList, checksch)
                  count_bulk = 0
              }

              console.log("stopTransmission", global.stopTransmission);

              //const conn = await _openCon()
              conn.promise().query('UPDATE tbLists SET status=1 WHERE idBot=' + global.idBot + ' AND id=' + idList + '').catch(console.log).then();
              //conn.end();
              await delay(b);
          }
      }

      global.sendListRun = false
  } catch (error) {
      console.log(error)
  }
}
module.exports = _sendList;
