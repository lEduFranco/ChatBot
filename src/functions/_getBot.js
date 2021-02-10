const _openCon = require('./_openCon');
const _initBot = require('./_initBot');

const portBot = process.env.PORTBOT
const fs = require('fs');
const BD_CONNECT_BOT = require( '../../connection.json');

var whitelist = ['*'];
let dconn = '';

var apiKey = '';
var idBot = 0;

if (fs.existsSync(BD_CONNECT_BOT)) {
  fs.readFile(BD_CONNECT_BOT, async (err, data) => {
      if (err) throw err;
      dconn = JSON.parse(data)
      await _getBot()
  })
}

async function _getBot() {
  try {
      const conn = await _openCon();
      console.log('_getBot = SELECT * FROM tbStores WHERE port=' + portBot + ' AND status=1');
      await conn.promise().query('SELECT * FROM tbStores WHERE port=' + portBot + ' AND status=1').then(async ([rows, fields]) => {
          if (rows.length > 0) {
              infoStore = rows[0]
              idBot = rows[0].idBot
              apiKey = rows[0].apiKey
              console.log("apiKey:", apiKey);
              if (rows[0].cors != null && rows[0].cors != '') {
                  whitelist.push(rows[0].cors)
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
