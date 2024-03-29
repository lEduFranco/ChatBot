const _sendImg = require('./_sendImg');

async function _newStatus(data) {
  try {
      return new Promise(async function (resolve, reject) {
          if (data.image != null) {
              await _sendImg('status@broadcast', data.text, global.config.urlMedia + data.image)
              resolve('success')
          } else {
              await global.client.sendMessage('status@broadcast', data.text).then((e) => {
                  resolve('success')
              })
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _newStatus;
