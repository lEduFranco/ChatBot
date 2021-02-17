const _openCon = require('./_openCon');

async function changeState(state) {
  const conn = await _openCon()
  try {
      const a = await conn.promise().query('UPDATE tbConfigBot SET state=' + state + ' WHERE idBot=' + global.idBot + '').catch(console.log())
      await Promise.all(a)
      global.config.state = state
      return true
  } catch (error) {
      console.log(error)
  }
}
module.exports = changeState;
