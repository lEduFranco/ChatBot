async function _notifyAdmin(message) {
  try {
      if (global.authenticated) {
          message = JSON.stringify(message)
          message += '.'
          //await client.sendMessage('554196238369@c.us', message)
      }
  } catch (error) {
      console.log(error)
  }
}
module.exports = _notifyAdmin;
