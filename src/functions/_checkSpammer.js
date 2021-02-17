async function _checkSpammer(id) {
  try {
      if (global.spammers[id] > new Date()) {
        global.spammers[id]['burst']++
          if (global.spammers[id]['burst'] >= 3) {
              let cont = await global.client.getContactById(id)
              await cont.block()
          }
          return false
      } else {
          const timeoutUntil = new Date();
          timeoutUntil.setSeconds(timeoutUntil.getSeconds() + 5);
          global.spammers[id] = timeoutUntil;
          global.spammers[id]['burst'] = 0
          return true
      }
  } catch (error) {
      console.log(error)
  }
}
module.exports = _checkSpammer;
