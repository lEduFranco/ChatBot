
const _openCon = require('./_openCon');
const startBotChat = require('./startBotChat');

let config = '';
var idBot = 0;

var authenticated = false;
var started = false

let sectors = []
let sectors_ = []
let subsectors = []
let subsectors_ = []
let schedules = []
let answers = []

let ms


async function _initBot() {
  console.log(new Date(Date.now()).toLocaleTimeString(), ' - _initBot')
  try {
      const conn = await _openCon();
      sectors = [];
      sectors_ = [];
      subsectors = [];
      schedules = [];
      subsectors_ = [];
      answers = [];
      started = true;

      //console.log('SELECT * FROM tbConfigBot WHERE idBot = ' + idBot + ' LIMIT 1');
      await conn.promise().query('SELECT * FROM tbConfigBot WHERE idBot = ' + idBot + ' LIMIT 1').then(([rows, fields]) => {
          console.log("tbConfigBot: " + rows.length);
          if (rows.length > 0) {
              config = rows[0];
              config.options = JSON.parse(rows[0].options);
              config.options = config.options.options;

              ms = config.options.msgDelay;
          }
      }).then(async () => {
          //console.log('SELECT * FROM tbSectors WHERE idBot = ' + idBot + ' AND hidden=0 ORDER BY digito ASC');
          await conn.promise().query('SELECT * FROM tbSectors WHERE idBot = ' + idBot + ' AND hidden=0 ORDER BY digito ASC').then(([rows, fields]) => {
              console.log("tbSectors: " + rows.length);
              if (rows.length > 0) {
                  sectors_ = rows
                  rows.forEach(element => {
                      sectors.push('*'+element.digito + '* - ' + element.mensagem)
                  });
              }
          }).then(async () => {
              //console.log('SELECT * FROM tbSubsectors WHERE idBot = ' + idBot + ' AND hidden=0 ORDER BY digito ASC');
              await conn.promise().query('SELECT * FROM tbSubsectors WHERE idBot = ' + idBot + ' AND hidden=0 ORDER BY digito ASC').then(([rows, fields]) => {
                  console.log("tbSubsectors: " + rows.length);
                  if (rows.length > 0) {
                      subsectors_ = rows
                      rows.forEach(element => {
                          subsectors.push(element.digito + ' - ' + element.mensagem)
                      });
                  }
              }).then(async () => {
                  //console.log('SELECT schedules FROM tbSchedules WHERE idBot = ' + idBot + '');
                  await conn.promise().query('SELECT schedules FROM tbSchedules WHERE idBot = ' + idBot + '').then(([rows, fields]) => {
                      console.log("tbSchedules: " + rows.length);
                      if (rows.length > 0) {
                          schedules = JSON.parse(rows[0].schedules)
                      }
                  }).catch(console.log)
                      .then(async () => {
                          //console.log('SELECT ta.*, GROUP_CONCAT(ts.url) as imgs FROM tbAnswers ta LEFT JOIN tbStorage ts ON ts.idAnswer=ta.id WHERE ta.idBot = ' + idBot + ' GROUP BY ta.id ORDER BY ts.id ASC');
                          await conn.promise().query('SELECT ta.*, GROUP_CONCAT(ts.url) as imgs FROM tbAnswers ta LEFT JOIN tbStorage ts ON ts.idAnswer=ta.id WHERE ta.idBot = ' + idBot + ' GROUP BY ta.id ORDER BY ts.id ASC').then(([rows]) => {
                              console.log("tbAnswers tbStorage: " + rows.length);
                              if (rows.length > 0) {
                                  answers = rows
                              }
                          }).then(async () => {
                              console.log("authenticated", authenticated);
                              if (!authenticated) {
                                  console.log("config.state", config.state);
                                  if (config.state == 1) {
                                      await startBotChat()
                                  } else {
                                      started = false
                                  }
                              }
                          }).catch(console.log)
                              .then(() => conn.end());
                      });
              }).catch(console.log)
                  .then();
          }).catch(console.log)
              .then();
      }).catch(console.log)
          .then();
  } catch (error) {
      console.log(error)
  }
}
module.exports = _initBot;
