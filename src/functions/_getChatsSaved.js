const _openCon = require('./_openCon');

async function _getChatsSaved() {
  try {
      const conn = await _openCon();
      let obj = ''
      await conn.promise().query('SELECT numeroConv FROM tbChats WHERE idBot=' + global.idBot + '').then(([rows, fields]) => {
          obj = rows
      }).catch(console.log)
          .then();;
      return obj;
  } catch (error) {
      console.log(error)
  }
}
module.exports = _getChatsSaved;
