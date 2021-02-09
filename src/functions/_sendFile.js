import fs from 'fs';
import path from 'path';

const { v4: uuidv4 } = require('uuid');

let client = [];


async function _sendFile(idChat, url) {
  return new Promise((resolve) => {
      var name = uuidv4()
      var name_ = ''
      var download = async function (uri, filename, callback) {
          request.head(uri, async function (err, res, body) {
              name_ = filename + path.extname(url)
              console.log("_sendFile: ", './media/' + filename + path.extname(url));
              request(uri).pipe(fs.createWriteStream('./media/' + filename + path.extname(url))).on('close', callback);
          });
      };
      download(url, path.basename(url, path.extname(url)), async function () {
          const media = MessageMedia.fromFilePath('./media/' + name_);
          await client.sendMessage(idChat, media).then(() => {
              var ext = path.extname(name_)
              console.log("_sendFile download: ", './media/' + name_);
              if (fs.existsSync('./media/' + name_)) {
                  fs.unlinkSync('./media/' + name_);
              }
              resolve({ status: true, url: url, ext: ext })
          });
      })
  })
}
export default _sendFile;
