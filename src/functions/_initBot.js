
const _openCon = require('./_openCon');
const startBotChat = require('./startBotChat');

async function _initBot() {
  console.log(new Date(Date.now()).toLocaleTimeString(), ' - _initBot')
  try {
      const conn = await _openCon();

      console.log('SELECT * FROM tbConfigBot WHERE idBot = ' + global.idBot + ' LIMIT 1');
      await conn.promise().query('SELECT * FROM tbConfigBot WHERE idBot = ' + global.idBot + ' LIMIT 1').then(([rows, fields]) => {
          console.log("tbConfigBot: " + rows.length);
          if (rows.length > 0) {
              console.log(rows[0]);
              config = rows[0];
              config.options = JSON.parse(rows[0].options);
              config.options = config.options.options;

              ms = config.options.msgDelay;
          }
      }).then(async () => {
          console.log('SELECT * FROM tbSectors WHERE idBot = ' + global.idBot + ' AND hidden=0 ORDER BY digito ASC');
          await conn.promise().query('SELECT * FROM tbSectors WHERE idBot = ' + global.idBot + ' AND hidden=0 ORDER BY digito ASC').then(([rows, fields]) => {
              console.log("tbSectors: " + rows.length);
              if (rows.length > 0) {
                  sectors_ = rows
                  rows.forEach(element => {
                      global.sectors.push('*'+element.digito + '* - ' + element.mensagem)
                  });
              }
          }).then(async () => {
              console.log('SELECT * FROM tbSubsectors WHERE idBot = ' + global.idBot + ' AND hidden=0 ORDER BY digito ASC');
              await conn.promise().query('SELECT * FROM tbSubsectors WHERE idBot = ' + global.idBot + ' AND hidden=0 ORDER BY digito ASC').then(([rows, fields]) => {
                  console.log("tbSubsectors: " + rows.length);
                  if (rows.length > 0) {
                      subsectors_ = rows
                      rows.forEach(element => {
                        global.subsectors.push(element.digito + ' - ' + element.mensagem)
                      });
                  }
              }).then(async () => {
                  console.log('SELECT schedules FROM tbSchedules WHERE idBot = ' + global.idBot + '');
                  await conn.promise().query('SELECT schedules FROM tbSchedules WHERE idBot = ' + global.idBot + '').then(([rows, fields]) => {
                      console.log("tbSchedules: " + rows.length);
                      if (rows.length > 0) {
                        global.schedules = JSON.parse(rows[0].schedules)
                      }
                  }).catch(console.log)
                      .then(async () => {
                          console.log('SELECT ta.*, GROUP_CONCAT(ts.url) as imgs FROM tbAnswers ta LEFT JOIN tbStorage ts ON ts.idAnswer=ta.id WHERE ta.idBot = ' + global.idBot + ' GROUP BY ta.id ORDER BY ts.id ASC');
                          await conn.promise().query('SELECT ta.*, GROUP_CONCAT(ts.url) as imgs FROM tbAnswers ta LEFT JOIN tbStorage ts ON ts.idAnswer=ta.id WHERE ta.idBot = ' + global.idBot + ' GROUP BY ta.id ORDER BY ts.id ASC').then(([rows]) => {
                              console.log("tbAnswers tbStorage: " + rows.length);
                              if (rows.length > 0) {
                                global.answers = rows
                              }
                          }).then(async () => {
                              console.log("authenticated", global.authenticated);
                              if (!global.authenticated) {
                                  console.log("config.state", global.config.state);
                                  if (global.config.state == 1) {
                                      await startBotChat()
                                  } else {
                                    global.started = false
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
