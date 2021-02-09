import _sendImg from './_sendImg;'

let client = [];
let config = '';

async function _newStatus(data) {
  try {
      return new Promise(async function (resolve, reject) {
          if (data.image != null) {
              await _sendImg('status@broadcast', data.text, config.urlMedia + data.image)
              resolve('success')
          } else {
              await client.sendMessage('status@broadcast', data.text).then((e) => {
                  resolve('success')
              })
          }
      })
  } catch (error) {
      console.log(error)
  }
}
export default _newStatus;
