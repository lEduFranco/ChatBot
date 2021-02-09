import _openCon from './_openCon';

var idBot = 0;
let config = '';

async function changeState(state) {
  const conn = await _openCon()
  try {
      const a = await conn.promise().query('UPDATE tbConfigBot SET state=' + state + ' WHERE idBot=' + idBot + '').catch(console.log())
      await Promise.all(a)
      config.state = state
      return true
  } catch (error) {
      console.log(error)
  }
}
export default changeState;
