import _openCon from './_openCon';

var idBot = 0;

async function _getChatsSaved() {
  try {
      const conn = await _openCon();
      let obj = ''
      await conn.promise().query('SELECT numeroConv FROM tbChats WHERE idBot=' + idBot + '').then(([rows, fields]) => {
          obj = rows
      }).catch(console.log)
          .then();;
      return obj;
  } catch (error) {
      console.log(error)
  }
}
export default _getChatsSaved;
