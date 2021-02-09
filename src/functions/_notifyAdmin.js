var authenticated = false;

async function _notifyAdmin(message) {
  try {
      if (authenticated) {
          message = JSON.stringify(message)
          message += '.'
          //await client.sendMessage('554196238369@c.us', message)
      }
  } catch (error) {
      console.log(error)
  }
}
export default _notifyAdmin;
