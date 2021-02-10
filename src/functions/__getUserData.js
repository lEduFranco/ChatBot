const _openCon = require ('./_openCon');

async function __getUserData(data) {
  try {
      return new Promise(async (resolve) => {
          const conn = await _openCon()
          let a = await client.getContactById(data.idInt).then((e) => {
              resolve(e)
          })
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = __getUserData;
