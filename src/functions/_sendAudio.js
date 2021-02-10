const fs = require('fs');
const path = require('path');

const portBot = process.env.PORTBOT
const { v4: uuidv4 } = require('uuid');
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});

let client = [];
let attendants = [];


async function _sendAudio(data) {

  return new Promise(async (resolve) => {
      var name = uuidv4()
      var name_ = ''
      let chat_ = await client.getChatById(data.idChat)
      chat_.sendStateRecording()
      var download = async function (uri, filename, callback) {
          request.head(uri, async function (err, res, body) {
              name_ = filename + path.extname(data.url)
              request(uri).pipe(fs.createWriteStream('./media/' + filename + path.extname(data.url))).on('close', callback);
          });
      };
      download(data.url, name, async function () {
          return new Promise(async (resolve) => {
              var filename = './files/' + uuidv4() + '.mp3'
              ffmpeg('./media/' + name_).toFormat('mp3').on('error', (err) => {
                  console.log('erro', err)
              })
                  .on('end', async function (stdout, stderr) {
                      const media = MessageMedia.fromFilePath(filename);
                      await client.sendMessage(data.idChat, media, { sendAudioAsVoice: true }).then(async (res) => {
                          attendants.filter((e) => e.idAtendente == data.idAtend).map((e) => {
                              io.of('/' + portBot).to(e.idSocket).emit('msgSended', { status: true, hasQuotedMsg: true, id: res.id.id, idBubble: data.id, serialized: res.id._serialized })
                          })

                          if (fs.existsSync(filename)) {
                              fs.unlinkSync(filename);
                          }
                          chat_.clearState(chat_)
                          resolve(true)
                      });
                  }).save(filename)
          })
          // const media = MessageMedia.fromFilePath('./media/' + name_);
          // await client.sendMessage(idChat, media, { sendAudioAsVoice: true });
          // if (fs.existsSync('./media/' + name_)) {
          //     fs.unlinkSync('./media/' + name_);
          // }
      })
  })
}
module.exports = _sendAudio;
