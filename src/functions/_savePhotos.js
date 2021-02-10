const _openCon = require('./_openCon');

var idBot = 0;

async function _savePhotos() {
  const conn = await _openCon()
  try {
      let list = []
      await conn.promise().query('SELECT idInt FROM tbLeads WHERE idBot=' + idBot + '').then(async ([rows, fields]) => {
          var count = rows.length
          let data = rows
          let obj = []
          if (count > 0 && count <= 1000) {
              const prom = rows.map(async (element) => {
                  var pic = await client.getProfilePicUrl(element.idInt)
                  obj.push([element.idInt, pic])
              });
              await Promise.all(prom);
              await conn.promise().query('INSERT INTO tbImgLeads (idInt, url) VALUES ?', [obj]).catch(console.log).then();
          } else if (count > 1000) {
              var div = Math.round(count / 500)
              var limit = 500
              for (let a = 0; a < div; a++) { // 3x
                  obj = []
                  for (let b = 0; b < limit; b++) {
                      var pic = await client.getProfilePicUrl(data[b].idInt)
                      obj.push([data[b].idInt, pic])
                      data.splice(b, 1)
                  }
                  if (data.length < limit) {
                      limit = data.length
                  }
                  await conn.promise().query('INSERT INTO tbImgLeads (idInt, url) VALUES ?', [obj]).catch(console.log).then();
              }
          }
      }).catch(console.log).then();;

  } catch (error) {
      console.log(error)
  }
}
module.exports = _savePhotos;
