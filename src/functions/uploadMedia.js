import fs from 'fs';
var urlSite = '';

async function uploadMedia(file, type, ext) {
  try {
      return new Promise(async (resolve) => {
          var options = {
              'method': 'POST',
              'url': urlSite + '/api',
              'headers': {

              },
              'json': true,
              formData: {
                  'func': 'saveMedia',
                  'type': type,
                  'file': fs.createReadStream(file)
              }
          };
          request(options, function (error, response) {
              if (error) throw new Error(error);
              if (response.body != null) {
                  let a = response.body.toString()
                  let b = a.split(',')
                  if (b[1] != 'erro') {
                      resolve({ link: b[1], type: type, ext: ext })
                  } else {
                      resolve('erro')
                  }
              }
          });
      })
  } catch (error) {
      console.log(error)
  }
}
export default uploadMedia;
