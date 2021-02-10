const fs = require('fs');
const request = require('request').defaults({ encoding: null });
const path = require('path');

let config = '';

async function _getImagesList(urls) {
  try {
      let imgs = []
      var down = async (e) => {
          return new Promise((resolve, reject) => {
              var name = uuidv4()
              var urld = config.urlMedia + e
              request.head(urld, async function (err, res, body) {
                  console.log("_getImagesList: ", './media/' + name + path.extname(urld));
                  request(urld).pipe(fs.createWriteStream('./media/' + name + path.extname(urld))).on('close', () => resolve({ url: './media/' + name + path.extname(urld) }));
              });
          })
      }
      for await (let e of urls) {
          let a = await down(e)
          imgs.push(a)
      }
      return imgs
  } catch (error) {
      console.log(error)
  }
}
module.exports = _getImagesList;
