import fs from 'fs';
import path from 'path';

const { v4: uuidv4 } = require('uuid');

let client = [];

async function _sendImgs(idChat, Texto, urls) {
  try {
      urls = urls.split(',');
      console.log("urls: ", urls);
      var download = async function (uri, filename, callback) {
          console.log("uri: ", uri);
          request.head(uri, async function (err, res, body) {
              console.log("_sendImgs: ", './media/', filename, path.extname(uri));
              request(uri).pipe(fs.createWriteStream('./media/' + filename + path.extname(uri))).on('close', callback);
          });
      };
      let a = urls.map(async (e, idx) => {
          var name = uuidv4()
          var urld = config.urlMedia + e
          await download(urld, name, async function () {
              console.log("_sendImgs download: ", './media/' + name + path.extname(urld));
              const media = MessageMedia.fromFilePath('./media/' + name + path.extname(urld));
              await client.sendMessage(idChat, media, {
                  caption: idx == 0 ? Texto : ''
              }).then()
              if (fs.existsSync('./media/' + name + path.extname(urld))) {
                  fs.unlinkSync('./media/' + name + path.extname(urld));
              }
          })
      })
  } catch (error) {
      console.log(error)
  }
}
export default _sendImgs;
