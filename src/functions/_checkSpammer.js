const spammers = {};

let client = [];

async function _checkSpammer(id) {
  try {
      if (spammers[id] > new Date()) {
          spammers[id]['burst']++
          if (spammers[id]['burst'] >= 3) {
              let cont = await client.getContactById(id)
              await cont.block()
          }
          return false
      } else {
          const timeoutUntil = new Date();
          timeoutUntil.setSeconds(timeoutUntil.getSeconds() + 5);
          spammers[id] = timeoutUntil;
          spammers[id]['burst'] = 0
          return true
      }
  } catch (error) {
      console.log(error)
  }
}
module.exports = _checkSpammer;
