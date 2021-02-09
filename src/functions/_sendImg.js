import fs from 'fs';
import path from 'path';

const { v4: uuidv4 } = require('uuid');

let client = [];

async function _sendImg(idChat, Texto, url) {
  var name = uuidv4()
  var name_ = ''
  var download = async function (uri, filename, callback) {
      request.head(uri, async function (err, res, body) {
          name_ = filename + path.extname(url)
          console.log("_sendImg: ", './media/' + filename + path.extname(url));
          request(uri).pipe(fs.createWriteStream('./media/' + filename + path.extname(url))).on('close', callback);
      });
  };
  download(url, name, async function () {
      const media = MessageMedia.fromFilePath('./media/' + name_);
      await client.sendMessage(idChat, media, { caption: Texto });
      console.log("_sendImg download: ", './media/' + name_);
      if (fs.existsSync('./media/' + name_)) {
          fs.unlinkSync('./media/' + name_);
      }
  })
}
export default _sendImg;
