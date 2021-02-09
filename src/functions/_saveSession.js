import _openCon from './_openCon';

var idBot = 0;

async function _saveSession(status, data) {
  return new Promise(async resolve => {
      try {
          const conn = await _openCon();
          if (status) {
              await conn.promise().query('UPDATE tbConfigBot SET session=' + conn.escape(JSON.stringify(data)) + ' WHERE idBot=' + idBot + ' LIMIT 1').then(() => {
                  resolve(true)
              })
          } else {
              await conn.promise().query('UPDATE tbConfigBot SET session="", state=0 WHERE idBot=' + idBot + ' LIMIT 1').catch(console.log).then(() => {
                  resolve(true)
              });
          }
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
export default _saveSession;
