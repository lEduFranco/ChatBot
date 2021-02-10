const uploadMedia = require('./uploadMedia');

const fs = require('fs');

async function _saveMedia(msg) {
  try {
      return new Promise(async (resolve) => {
          const attach = await msg.downloadMedia();
          var extension = "";
          if (attach.mimetype == "image/jpeg")
              extension = "jpg";
          else if (attach.mimetype == "image/png")
              extension = "png";
          else if (attach.mimetype == "image/gif")
              extension = "gif";
          else if (attach.mimetype == "image/webp")
              extension = "webp";
          else if (attach.mimetype == "image/bmp")
              extension = "bmp";
          else if (attach.mimetype == "text/plain")
              extension = "txt";
          else if (attach.mimetype == "application/pdf")
              extension = "pdf";
          else if ((attach.mimetype).toString().split(';')[0] == "audio/ogg")
              extension = "ogg";
          else if (attach.mimetype == "audio/mpeg")
              extension = "mp3";
          else if (attach.mimetype == "video/mp4")
              extension = "mp4";
          if (extension == "")
              return;
          // const file = "./files/" + msg.id.id + "." + extension;
          const file = attach.filename != undefined ? "./files/" + attach.filename.replace(/ /g, '-') : msg.id.id + '.' + extension
          fs.writeFile(file, attach.data, 'base64', async function (err) {
              if (err != null) {
                  console.log(err);
                  resolve(err)
              } else {
                  var type = msg.type
                  let c = await uploadMedia(file, type, extension)
                  resolve(c)
              }
          });
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _saveMedia;
