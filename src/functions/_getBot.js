
const _openCon = require('./_openCon');
const _initBot = require('./_initBot');

const portBot = process.env.PORTBOT

async function _getBot() {
  try {
      const conn = await _openCon();
      console.log('_getBot = SELECT * FROM tbStores WHERE port=' + portBot + ' AND status=1');
      await conn.promise().query('SELECT * FROM tbStores WHERE port=' + portBot + ' AND status=1').then(async ([rows, fields]) => {

        if (rows.length > 0) {
              global.infoStore = rows[0]
              global.idBot = rows[0].idBot
              global.apiKey = rows[0].apiKey

              if (rows[0].cors != null && rows[0].cors != '') {
                  global.whitelist.push(rows[0].cors)
              }

              await _initBot()
          } else {
              exec('pm2 delete ' + portBot + '', (error, stdout, stderr) => {
                  if (error) {
                      console.log(`error: ${error.message}`);
                      return
                  }
              });
          }
      }).catch(console.log).then();
  } catch (error) {
      console.log(error)
  }
}
module.exports = _getBot;
